# Harbor Demo

Harbor Docs:
------------
https://goharbor.io/docs/1.10/
https://goharbor.io/blog/harbor-2.0/

Harbor Compatibility List
-------------------------
https://goharbor.io/docs/1.10/install-config/harbor-compatibility-list/

------------------------------------------------
vagrant ssh node-1

    add entry in /etc/hosts for 
    <node-1-private-ip> myharbor.com

    vim /etc/docker/daemon.json
    "insecure-registries":["myharbor.com:30002"]

    sudo service docker restart
    sudo service docker status

vagrant ssh node-2

    add entry in /etc/hosts for 
    <node-2-private-ip> myharbor.com

    vim /etc/docker/daemon.json
    "insecure-registries":["myharbor.com:30002"]

    sudo service docker restart
    sudo service docker status

------------------------------------------------

Docker for Mac >> Preferences >> Docker Engine >> append the below property

"insecure-registries":["myharbor.com:30002"]

Restart Docker for Mac

------------------------------------------------


Steps for Container Images
--------------------------
1) Create harbor_demo folder in the same directory where you have cloned `k8-cluster` (outside k8-cluster project)
   ```bash
   mkdir harbor_demo
   cd harbor_demo
   cp ../k8s-cluster/.envrc .
   direnv allow .
   ```

   Download harbor helm chart.
   ```bash
   helm repo ls
   helm repo add harbor https://helm.goharbor.io
   helm pull harbor/harbor
   tar -xvzf harbor-1.3.2.tgz
   ls
   cd harbor
   helm ls -A
   ```

2) Create a new namespace for harbor
   ```bash
   kubectl create namespace registry
   ```

3) Install harbor
   ```bash
   helm install my-artifact-registry ./ -f values.yaml --set expose.type=nodePort 
     --set expose.tls.enabled=false --set externalURL="http://myharbor.com:30002" -n registry
   ```

4) Check helm installation
   ```bash
   helm ls -n registry

   kubectl get pods -n registry
   kubectl get pvc -n registry

   kubectl get pods -n registry -o wide --show-labels | awk {'print $1" " $10'} | column -t
   ```

Go to Admin configuration

5) Public docker registry example
   Create public project from harbor UI
   check **"Push Image Docker Command"** on the right hand side.
   ```bash
   docker pull hello-world
   docker tag hello-world:latest myharbor.com:30002/abc/hello-world:latest
   docker login myharbor.com:30002
   Push the docker image # docker push myharbor.com:30002/abc/hello-world:latest
   Remove the image from local machine # docker rmi myharbor.com:30002/abc/hello-world:latest
   Pull the docker image # docker pull myharbor.com:30002/abc/hello-world:latest
   ```

6) Scan the uploaded docker image.
   Automatic scanning can also be enabled from project settings. (Project >> Configuration). Click on save on bottom of the page.


7) Private docker registry example
   Create private project from harbor UI
   Docker login is required to interact with private project.
   Enable auto scanning of images from (Project >> Configuration). Click on save on bottom of the page.
   ```bash
   docker pull redis:4.0.1
   docker tag # docker tag redis:4.0.1 myharbor.com:30002/xyz/redis:4.0.1
   Push the docker image # docker push myharbor.com:30002/xyz/redis:4.0.1  # Should say access denied error in last line. 
   docker login myharbor.com:30002
   Push the docker image # docker push myharbor.com:30002/xyz/redis:4.0.1  # Should be successful
   check vulnerabilities by clicking on the image.
   Pull the docker image # Optional step
   ```

8) Robot account example
   docker logout myharbor.com:30002
   Create a Robot account from harbor UI
   Add the token in an environment variable
   ```bash
   docker login myharbor.com:30002 -u 'robot$jenkins' -p $JENKINS_ROBOT_TOKEN
   docker pull nginx:1.17.9
   docker tag nginx:1.17.9 myharbor.com:30002/xyz/nginx:1.17.9
   docker push myharbor.com:30002/xyz/nginx:1.17.9
   ```

9) User account example
   Create a user
   Login with that user
   Verify that only public repo's are visible
   Create a private project from this new user's account.
   Go to admin account and add the user to private repo as Developer role.

Steps for Helm chart
--------------------
1) Set helm repo
   Create public repo or use an existing public repo.
   Get the repo url (Doc Reference: https://goharbor.io/docs/1.10/working-with-projects/working-with-images/managing-helm-charts/)
   ```bash
   helm repo ls
   helm repo add myharborabc http://myharbor.com:30002/chartrepo/abc
   helm repo ls
   ```

2) Pull a helm chart from other repo
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm pull bitnami/postgresql
   ```

3) Push a helm chart to harbor helm repo
   Note: Pushing to both public and private projects requires authentication for helm charts.
   ```bash
   helm push postgresql-8.6.13.tgz myharborabc -u admin -p $HARBOR_ADMIN_PASSWORD
   ```

   An extracted helm chart can also be pushed to helm chart repo
   ```bash
   helm push postgresql myharborabc -u admin -p $HARBOR_ADMIN_PASSWORD
   ```

Helm 3 maintains repositories.yaml at ~/Library/Preferences/helm/repositories.yaml and not in ~/.helm directory.

4) Installing helm chart from harbor helm repo
   Delete the postgres tgz file
   ```bash
   kubectl create namespace db
   kubectl get pods -n db
   helm install mypostgres myharborabc/postgresql -n db
   ```
   check local cache at $HOME/Library/Caches/helm
   ```bash
   vim $HOME/Library/Caches/helm/repository/myharborabc-index.yaml
   ```
   ```bash
   helm repo update
   Search for postgresql block at $HOME/Library/Caches/helm/repository/myharborabc-index.yaml
   helm install mypostgres myharborabc/postgresql -n db --version 8.6.13
   kubectl get pods -n db
   kubectl get pvc -n db
   ```

5) Multi project setup
   Create public/private repo or use an existing public/private repo.
   ```bash
   helm repo ls
   helm repo add myharborxyz http://myharbor.com:30002/chartrepo/xyz
   helm repo ls
   ```
   Rest of the steps remains same as mentioned in step 3 and 4.
   
References for untrusted registry:
----------------------------------
1. https://docs.docker.com/registry/insecure/

2. https://docs.docker.com/ee/dtr/user/access-dtr/

