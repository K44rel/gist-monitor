# Provisioning GKE cluster and deploying manually
This is largely based on the [hashicorp tutorial](https://learn.hashicorp.com/tutorials/terraform/gke) 

### Requirements

- Google Cloud Platform account
- Configured gcloud SDK
- Installed kubectl

### Provisioning

#### Authenticate gcloud

```shell
gcloud auth application-default login
```

#### Populate terraform.tfvars file

Create a new file based on the example.
```shell
cp terraform.tfvars.example terraform.tfvars
```

Replace the placeholder values in `terraform.tfvars`.

`project_id` can be found by running

```shell
gcloud config get-value project
```

Available `region` values can be found in the [Google Cloud Console](https://console.cloud.google.com/compute/zones).

#### Initialize Terraform workspace
```shell
terraform init
```


#### Provision the GKE cluster

```shell
terraform apply
```

To confirm the apply enter `yes`.

#### Configure kubectl for deployment

```shell
gcloud container clusters get-credentials $(terraform output -raw kubernetes_cluster_name) --region $(terraform output -raw region)
```

### Deploy Redis

```shell
kubectl apply -f redis.yml
```

### Deploy gist-monitor and external load balancer

This will deploy the latest version from the Google Container Registry

```shell
kubectl apply -f node.yml
```

### Pushing new version

To push a new version of the app to Google Container Registry build a new version of gist-monitor with.

First export the project id into a variable, {project-id} is the output of the previously used `gcloud config get-value project` command.

```shell
export PROJECT_ID={project-id}
```

Next, build the production image. Replace {next version tag with a new version}.

```shell
docker build -t gcr.io/${PROJECT_ID}/gist-monitor:{next version tag} ../
```

Push image to the registry

```shell
docker push gcr.io/${PROJECT_ID}/gist-monitor:{next version tag}
```

Apply rolling update

```shell
kubectl set image deployment/gist-monitor gist-monitor=gcr.io/${PROJECT_ID}/gist-monitor:{next version tag} 
```

