# Cloud-Operations-Engineer-Assessments

User API:

    This is a simple Node.js API that provides endpoints for managing user data.

Prerequisites:

    - Node js, Docker
    - Kubernetes cluster (e.g., Minikube, Docker Desktop, or a cloud provider)

Getting Started:

   1. Clone the repository: https://github.com/sksabir019/Cloud-Operations-Engineer-Assessments.git

   2. Build the Docker image: 
        docker build -t your-docker-repo/node-user-api:latest . 
   (Replace your-docker-repo with your actual Docker repository URL.)
    
   3. Push the Docker image to your repository:
       docker push your-docker-repo/node-user-api:latest 
    (Replace your-docker-repo with your actual Docker repository URL.)

            [or Pull the image from docker hub]:
                docker pull shazam007/node-user-api

            Once you pull down the image, run the conatiner :
            docker run -p 3000:3000 shazam007/node-user-api

    4. K8:
        Apply the Kubernetes manifests:
         kubectl apply -f user-api-configmap.yaml
         kubectl apply -f user-api-deployment.yaml
         kubectl apply -f user-api-service.yaml
         kubectl apply -f user-api-job.yaml

         or : kubectl apply -f *.yaml

    This will create the necessary ConfigMap, Deployment, Service, and Job resources in your Kubernetes cluster.

    5. Wait for the application to be deployed and the Job to complete:
        kubectl get pods
        kubectl get jobs

        Ensure that all the pods are running and the load-data-job completes successfully.

    6. Access the application: 
        kubectl get service node-user-api

    API Endpoints:
        - GET /v1/users: Retrieve a list of users.
        - POST /v1/users: Create a new user.
        - GET /v1/users/:userId: Retrieve a user by ID.

    Customization:
        You can modify the data.csv file to change or add user data. After updating the file, run the Job again to load the new data into the application.
