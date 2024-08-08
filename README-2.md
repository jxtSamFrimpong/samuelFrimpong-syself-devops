## Production-grade Kubernetes environment

First the hardware need to be set up, bare metal servers, switches and routers will be set up in such a way that it will result in:

* Three different *failure domains*: e.i it each failure domain will be completely independent of the other in terms of power supply, networking, underlying compute hardware and storage.
* Two networks in each failure domain.
  In total making six networks that form a giant main "cluster network"
  In each failure domain, one is configured to be **private** and only accesible from within that particular failure domains and adjacent failure domains(using iptables, route tables or similar approach), then another to be **public** and reacheable from outside the cluster network
* Two Bare metal Servers(16GB RAM    8 CPU Core    50GB Storage), will be installed in two of the three *private subnets* , will be used for master nodes
  Three Ubuntu 24.04 Server(16GB RAM     8CPU Core 100GB Storage), will be set up in the three private subnets, will be used for the worker nodes
  One Ubuntu 24.04 Server(16GB RAM     8CPU Core 100GB Storage) in the public subnet. Will be used as NAT server, bastion host, load balancer and internet gateway
* The cluster will be networked such that one server can ssh into another, with the right firewall rules as specified in the guide on [kubernetes.io]()
  [[https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/]()]
* Kubeadm will be used to bootstrap the kubernetes cluster with the detailed guide from [kubernetes.io]()
  [[https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/]()]
  The guide goes through having the dependencies needed, container networking interface, a container runtime, DNS, storage interface
  The cluster will have three private worker nodes, two private master nodes and one public node to be used as NAT/load_balancer/bastion server/internet gateway
* Set up additional controllers such as ingress controllers to use the public server for ingress, and it goes through the already set up internet gateway
* Access cluster endpoint through bastion server and authenticate with it
  Create service account with RBAC to grant permissions to deploy, undo deploy, update deployment applications which will be used by an ArgoCD client to deploy kubernetes applications and configurations into the cluster

  Though all the above would work, it is hhighly tedious and difficult to maintain
  One way of making it sustainable is using IaC such as Terraform or Vagrant to provision the underlying architecture, and ansible for the configurations needed before setting up the cluster with kubeadm
  Then an automated CI/CD workflow like Jenkins will be used to push docker applcations to a container registery hosted on a self hosted JFROG Artifactory domain on the Public node (but the registery is private where only authenticated users can access)
  ArgoCD/FluxCD will be great to deploy applicatio from container registery into the cluster and update in-place while we push new images to the registery



Cluster Summary

IaC to provision infrastructure

1 Bastion/NAT/Internet GW node on public sub

2 Master nodes on private subs

3 Worker nodes

Kubeadm cluster

Service account for CI/CD application

CI to push docker to artifactory docker registery

CD to deploy application into kubernetes cluster
