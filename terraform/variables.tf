variable "account_id" {
  type = string
}

variable "discord_client_token" {
  type      = string
  sensitive = true
}

variable "psql_host" {
  type      = string
  sensitive = true
}

variable "psql_username" {
  type      = string
  sensitive = true
}

variable "psql_password" {
  type      = string
  sensitive = true
}
