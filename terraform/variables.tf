variable "ami_ubuntu" {
  type        = string
  description = "Ubuntu 20.04 LTS x64_86 AMI"
}

variable "instance_type" {
  type = string
}

variable "account_id" {
  type = string
}

variable "region" {
  type = string
}
