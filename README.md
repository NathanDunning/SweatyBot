# SweatyBot

My personalised discord bot for our server

### Issues for future

One of the issues encountered was deploying to ECS Fargate through a pipeline. As of currently, the only way an ECS Task can be ran without a service is through the AWS UI. When using Terraform, an ECS Service must be created which runs ECS Tasks. This way, the service ensures that your Tasks (containers) are running 100% of the time. At the time, I have not yet implemented image tagging so all images were tagged with `latest` and the tasks did not seem to update to use a new image with the same tag. As a result, I had to deploy a new service which referenced the new task for each update; this was feasible as I did not require 100% uptime. The issue occured as I was using the same name for each service deployment, and was getting this error: `Error: InvalidParameterException: Creation of service was not idempotent. "SweatyBot"`. To fix this, until I add image semantic versioning and split out the implementation of my app so I leverage load balancers, I had to change the name of my service each time I wanted to deploy by adding a suffix that corresponds to the Github build id. Although with this approach, there will be guaranteed downtime, adding the Terraform lifecycle hook `create_before_destroy` helps keep downtime down to a minimum (~15 seconds).
