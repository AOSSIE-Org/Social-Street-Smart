provider "aws" {
  region = "us-east-1"  # Replace with your AWS region
}

resource "aws_dynamodb_table" "news_table" {
  name           = "NewsTable"  # Replace with your table name
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "News DynamoDB Table"
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.news_table.name
}
