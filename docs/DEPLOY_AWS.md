# Deploy `product` lên AWS (S3 + CloudFront)

Hướng dẫn 1 lần để bản `product` của **Web-Pimi-for-user** tự động build và deploy lên AWS mỗi khi có
push vào nhánh `product`, thay cho Vercel. Bạn cần chạy các bước dưới đây bằng chính AWS CLI/Console
của bạn — Claude không có quyền truy cập tài khoản AWS để làm thay.

Workflow tương ứng đã có sẵn tại `.github/workflows/deploy-product.yml` (build Vite → sync S3 →
invalidate CloudFront). Phần còn lại là tạo hạ tầng AWS + khai báo secrets/variables trên GitHub.

> **Gắn tên miền:** làm hết bước 1-3 ở đây trước (tạo bucket + CloudFront distribution), rồi sang
> `bff-for-pimi/docs/DEPLOY_AWS.md` mục 7 để tạo Route 53 record cho domain thật — tài liệu đó gom
> chung phần domain cho cả 3 trang (2 web + backend) để không phải lặp lại hướng dẫn Route 53 3 lần.

> Thay `<...>` bằng giá trị thật của bạn. Region gợi ý `ap-southeast-1` (Singapore, gần Việt Nam nhất) —
> đổi nếu bạn đã có hạ tầng AWS khác vùng.

## 1. Tạo S3 bucket (lưu file build, KHÔNG public trực tiếp)

```bash
aws s3api create-bucket \
  --bucket pimi-web-user-product \
  --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1

aws s3api put-public-access-block \
  --bucket pimi-web-user-product \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Bucket giữ private hoàn toàn — chỉ CloudFront (qua Origin Access Control ở bước 3) được đọc, không ai
truy cập thẳng URL S3 được.

## 2. Xin chứng chỉ SSL cho domain (ACM) — nếu dùng domain riêng

CloudFront cần chứng chỉ nằm ở **vùng us-east-1** (bắt buộc, bất kể bucket đặt vùng nào):

```bash
aws acm request-certificate \
  --domain-name pimi.vn \
  --subject-alternative-names "www.pimi.vn" \
  --validation-method DNS \
  --region us-east-1
```

Sau đó vào ACM Console thêm bản ghi CNAME xác thực vào DNS của domain, đợi trạng thái chuyển
`ISSUED` rồi mới làm bước 3. Nếu chưa có domain riêng, có thể bỏ qua bước này và dùng domain
`*.cloudfront.net` mặc định tạm thời.

## 3. Tạo CloudFront distribution

Cách nhanh nhất: vào **CloudFront Console → Create distribution**:

- **Origin domain**: chọn đúng bucket `pimi-web-user-product` (S3) — Console sẽ tự đề nghị tạo
  **Origin Access Control (OAC)** và tự cập nhật bucket policy cho bạn khi bấm "Create" → bấm đồng ý.
- **Viewer protocol policy**: Redirect HTTP to HTTPS.
- **Alternate domain name (CNAME)**: `pimi.vn`, `www.pimi.vn` (nếu có domain riêng — chọn chứng chỉ ACM
  vừa tạo ở bước 2).
- **Default root object**: `index.html`.
- **Custom error responses** (mục quan trọng nhất — thiếu bước này thì F5 vào 1 route con như
  `/rooms/abc` sẽ ra lỗi 403/404 vì file đó không tồn tại thật trên S3, React Router xử lý route ở
  phía client):
  | HTTP error code | Response page path | Response code |
  |---|---|---|
  | 403 | `/index.html` | 200 |
  | 404 | `/index.html` | 200 |

Ghi lại **Distribution ID** (dạng `E1A2B3C4D5E6F7`) sau khi tạo xong — cần cho bước 5.

## 4. Cho phép GitHub Actions xin quyền AWS tạm thời (OIDC — không lưu access key)

Tạo 1 lần cho cả tài khoản AWS (bỏ qua nếu đã làm cho repo khác trước đó):

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

Tạo policy chỉ cho phép đúng bucket + đúng distribution này (nguyên tắc quyền tối thiểu):

```bash
cat > pimi-web-user-deploy-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::pimi-web-user-product",
        "arn:aws:s3:::pimi-web-user-product/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<AWS_ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name pimi-web-user-deploy-policy \
  --policy-document file://pimi-web-user-deploy-policy.json
```

Tạo role, chỉ tin tưởng đúng repo `letrunghieu0803/pimi-web-for-user`, đúng nhánh `product` (không
repo/nhánh nào khác xin được quyền này):

```bash
cat > pimi-web-user-trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        "StringLike": { "token.actions.githubusercontent.com:sub": "repo:letrunghieu0803/pimi-web-for-user:ref:refs/heads/product" }
      }
    }
  ]
}
EOF

aws iam create-role \
  --role-name pimi-web-user-deploy-role \
  --assume-role-policy-document file://pimi-web-user-trust-policy.json

aws iam attach-role-policy \
  --role-name pimi-web-user-deploy-role \
  --policy-arn arn:aws:iam::<AWS_ACCOUNT_ID>:policy/pimi-web-user-deploy-policy
```

Ghi lại **Role ARN** (`arn:aws:iam::<AWS_ACCOUNT_ID>:role/pimi-web-user-deploy-role`) — cần cho bước 5.

## 5. Khai báo Secrets/Variables trên GitHub

Vào repo trên GitHub → **Settings → Environments → New environment** → đặt tên `production` (khớp
`environment: production` trong workflow) → sau đó thêm vào **environment** này (khuyến nghị, an toàn
hơn để ở repo-level vì chỉ áp dụng khi deploy):

**Secrets** (Settings → Environments → production → Environment secrets):
| Tên | Giá trị |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | Role ARN ghi lại ở bước 4 |
| `VITE_API_ENDPOINT` | URL API backend production (bản `product` của `bff-for-pimi`) |
| `VITE_SOCKET_URL` | URL socket production |
| `VITE_SITE_URL` | `https://pimi.vn` (hoặc domain thật bạn dùng) |
| `VITE_FIREBASE_API_KEY` | Lấy từ Firebase Console → Project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | ″ |
| `VITE_FIREBASE_PROJECT_ID` | ″ |
| `VITE_FIREBASE_STORAGE_BUCKET` | ″ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ″ |
| `VITE_FIREBASE_APP_ID` | ″ |
| `VITE_FIREBASE_MEASUREMENT_ID` | ″ |
| `VITE_FIREBASE_VAPID_KEY` | ″ |
| `VITE_VIETMAP_API_KEY` | Lấy từ VietMap Console |
| `VITE_DEFAULT_VIETMAP_API_KEY` | ″ |

**Variables** (tab Variables cùng chỗ):
| Tên | Giá trị |
|---|---|
| `AWS_REGION` | `ap-southeast-1` (hoặc vùng bạn chọn ở bước 1) |
| `AWS_S3_BUCKET` | `pimi-web-user-product` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Distribution ID ghi lại ở bước 3 |

## 6. Trỏ domain (nếu dùng domain riêng)

Ở DNS provider của domain (Route 53 hoặc nơi khác), tạo bản ghi trỏ về CloudFront:
- **Route 53**: tạo Alias record trỏ thẳng tới CloudFront distribution (không tốn phí, tự cập nhật IP).
- **DNS provider khác**: tạo CNAME `pimi.vn` → `<distribution-id>.cloudfront.net`.

## 7. Kiểm tra

Push (hoặc merge) vào nhánh `product` → vào tab **Actions** trên GitHub xem workflow "Deploy product to
AWS" chạy — nếu xanh, vào domain/`https://<distribution-id>.cloudfront.net` kiểm tra trang chạy đúng,
thử F5 ở 1 route con (vd `/rooms`) để xác nhận custom error response ở bước 3 hoạt động.

## Ngừng dùng Vercel

Sau khi xác nhận AWS chạy ổn, vào Vercel Dashboard → Project → Settings → Git, gỡ kết nối
repo (hoặc xoá project) để tránh 2 nơi cùng deploy gây nhầm lẫn URL nào là bản thật.
