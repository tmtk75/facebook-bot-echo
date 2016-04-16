variable "heroku_email" {}
variable "heroku_api_key" {}
variable "app_name" { default = "facebook-bot-chae0phe" }

provider "heroku" {
    email   = "${var.heroku_email}"
    api_key = "${var.heroku_api_key}"
}

resource "heroku_app" "line-bot" {
    name   = "${var.app_name}"
    region = "us"
    stack = "cedar-14"

    config_vars {
        ACCESS_TOKEN  = "a"
        VERIFY_TOKEN  = "b"
	BUILDPACK_URL = "https://github.com/kr/heroku-buildpack-go"
    }
}

