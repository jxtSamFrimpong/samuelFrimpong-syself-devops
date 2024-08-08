# Application

Its a simple application that users share blogs they find interesting for everyone else to have a look

###### **The architecture**

A Deployment of 1 replica which can be scaled by HPA to 5 depending on resource utilization. Thr deployment does regular health checks to ensure the application is healhy and ready to receive traffic.The deployment exposes a service which receives traffic from an ingress.

The cluster needs to be set up and configured to have an ingress-contoller installed(could do that by running 00-deploy-ingress-controller-bash.sh file), K8 metrics-server installed (runn 01-deply-metrics-server.sh)

GitOps tools like ArgoCd and FluxCD could be used to deploy the applications helm chart, or alternatively run 02-deploy-syself-backend-helm.sh

In order to be able to use the application, DNS should be configured to resolve the  api's host domain to the ip of the ingrss

Bonus 1: There is a "*test pod*" with dnsutils installed to provide a shell terminal to test if the application if the admin wishes to use that method of testing
Bonus 2: HPA capabilities could be tested with runing 03-stress-test.sh

# Database

The databases that I'd recommend would depend on the use case of the data being stored.

* **MongoDB** for persistent data
* **Redis** for expendable key-value data
* **Kafka** for events data

###### **MongoDB**

For data that needs to be persisted for as long as the application needs it, like user data, data about blogs and others, I'd use persistent storage soluton. As seen, my application already "talks" to a MongoDB database. MongoDB is a NoSQL database, it is schemaless which is exactly what I need for a simple  MERN stack application.

It stores information pertaining to the added blogs and registered users in the cluster. The serverless nature of the MongoDB cluster eases the admninistrator from the stress of having to deploy a MongoDB cluster and setting up necessary configurations, but if there's a need to do that then it could be achieved from the steps below

A namespace should be created for the MongoDb to be deployed, and the MongoDB database cluster deployed with a headless service to be used by the application. The databse will be deployed using the master-slave replication architecture to ensure high fault tolerance and high availability in a 1:2 ratio, with Persistent Disk Storage attached to the Pods to persist the data that comes in. (or probaly deply bitnami/mongodb helm chart to save myself some time to worry about other issues😉, do not reinvent the wheel), HPA could configured as well to make the database behave in an elastic manner that it'd have a serverless feel.

Then a network policy should be added to only allow the backend application to communicate with the database

Alternatively, an ExternalName resource could be used to provide access to a managed MongoDB database service from a cloud provider to the application using it

###### **Redis**

Currently, my application won't need a key-value data store, but if there's a need to store for example session data, and use that to force sign in when users have been away for a while. Redis is easy to develop with and has a rich amount of docs from the community

###### **Kafka**

Almost all big tech coorperations use kafka, its a testament of the trust the community has in it. For now my application doesnt process anything that will need the services of kafka, but as it grows into a cultural phenomenon among bibliophiles there would be the need to use kafka to stream events and messages that would trigger other processes to run or possibly be used for analytics
