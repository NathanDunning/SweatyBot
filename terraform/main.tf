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

data "aws_subnet" "a" {
  id = "subnet-a8e400ce"
}

data "aws_subnet" "b" {
  id = "subnet-0a899f43"
}

data "aws_subnet" "c" {
  id = "subnet-36a93e6e"
}

data "aws_security_group" "default" {
  id = "sg-fad4008b"
}

# -- RESOURCES -- #
resource "aws_ecs_service" "sweatybot" {
  name                               = "SweatyBot"
  cluster                            = data.aws_ecs_cluster.sweatybot.id
  task_definition                    = aws_ecs_task_definition.sweatybot.arn
  desired_count                      = 1
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  enable_ecs_managed_tags            = true
  force_new_deployment               = true
  launch_type                        = "FARGATE"
  propagate_tags                     = "TASK_DEFINITION"
  wait_for_steady_state              = true

  network_configuration {
    subnets          = [data.aws_subnet.a.id, data.aws_subnet.b.id, data.aws_subnet.c.id]
    security_groups  = [data.aws_security_group.default.id]
    assign_public_ip = true
  }
}

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
