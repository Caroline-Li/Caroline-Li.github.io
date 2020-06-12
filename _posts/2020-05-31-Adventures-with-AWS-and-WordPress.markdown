---
layout: post
title:  "Adventures with AWS and WordPress"
tag: Projects
date:   2020-05-31 09:54:48 -0500
categories: jekyll update
---

Newly lanuched WordPress website on AWS: [arclogic][arclogic_link]

This website is still in development, but I have a great vision for its future!
More details to be posted later!

## Website Hosting on AWS
AWS, I've heard, is a big giant cloud service, so I thought it would be the perfect place to host a website!
To do this, I launched an AWS EC2 (Elastic Compute Cloud) instance with a Linux OS. You may be wondering why 
this is necessary. After all, website are just html rendered on your browser, right?

Well, where is the html stored? How does your browser recieve this html? This where AWS comes to the rescue.
An EC2 instance on AWS can run web server code and store the html necessary for a website.
On my EC2 instance, I installed an Apache Web Server to handle HTTP get and post requests to the instance's ip
address. Finally, I installed WordPress and configured the Apache Web Server to serve my WordPress website.

## Dynamic WordPress
You may be thinking: wow that's pretty easy. All I had to do was install a web server and WordPress on the cloud.
The website is hosted like magic! However, this is only the beginning of my adventures with AWS and WordPress.

WordPress renders websites dynamically. That means WordPress doesn't store static HTML. Instead, it consults a
database that stores the HTML, Javascript, and other cool stuff. Once it recieves this information, a web server
can send the information to your browser. Pretty complicated, right? That's why WordPress websites are a little
slower than static websites like this blog site!

All this dynamic website stuff forced me to make a MySQL database in AWS. Alternatively, WordPress websites
are small enough that an official database isn't necessary. However, the cloud is about scalability! If my
website becomes famous one day and recieves lots of traffic, the storage from the EC2 instance won't be enough!

For these reasons, I launched an AWS RDS (Relational Database Service) instance that specifically stores my
WordPress website's data. To allow my WordPress website to talk to the RDS MySQL database, I configured security
groups in my EC2 instance and MySQL credentials in my WordPress configuration file.

## Website Done
That's it! I got a simple, template theme WordPress site up and running on AWS!
YAY!!!!





[arclogic_link]: http://www.arclogic.com/

