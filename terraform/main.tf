terraform {
  backend "s3" {
    bucket         = "terraform-state-backend-manager"
    key            = "sweatybot.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "terraform-state-locking"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.22.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
}


# -- DATA -- #
data "aws_ecs_cluster" "sweatybot" {
  cluster_name = "sweatybot-cluster"
}

data "aws_iam_role" "ecsTaskExecutionRole" {
  name = "ecsTaskExecutionRole"
}

# -- RESOURCES -- #
resource "aws_ecs_task_definition" "sweatybot" {
  family                = "sweatybot"
  container_definitions = <<TASK_DEFINITION
  [
    {
      "name": "sweatybot",
      "image": "${var.account_id}.dkr.ecr.ap-southeast-2.amazonaws.com/sweatybot:latest",
	    "logConfiguration": {
        "logDriver": "awslogs",
        "secretOptions": null,
        "options": {
          "awslogs-group": "/ecs/sweatybot",
          "awslogs-region": "ap-southeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "memoryReservation": 128
    }
  ]
  TASK_DEFINITION

  execution_role_arn       = data.aws_iam_role.ecsTaskExecutionRole.arn
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  requires_compatibilities = ["FARGATE"]
}
