---
layout: post
title:  "Ode to IoT Microcontrollers with AWS"
tag: Projects
date:   2020-06-11 09:54:48 -0500
categories: jekyll update
---

Microcontrollers! What are they?

## Microcontrollers and IoT
Microcontrollers are really awesome devices that can locally control sensors, other devices, and even connect to the
internet! They are integrated chips with processors, memory, and I/O pins. And they're everywhere! Microcontrollers
control how most of our beloved tech devices work today, from cars, dishwashers, and TVs. They usually live and
comprise an embedded system.

Okay, enough technical details. Why should we care about microcontrollers?

Well, in addition to their abundance in technology, they're also emerging in IoT (Internet of Things) 
technologies, where devices are connected to other devices through the internet! So cool! 
Think about Alexa or Hey Google.

## AWS IoT Messages
I recently decided to connect my ESP32 microcontroller to the cloud! After experimenting with AWS, I stumbled upon
AWS IoT, which allows you to connect a device to the cloud. In the AWS console, I simply made a device "thing",
and created a certificate to allow the ESP32 to connect to AWS. Easy, right?

Well, how does a certificate *magically* allow a device to connect to AWS? AWS can't verify the intent of the
device. For all it knows, the device could be malicious. But AWS trusts the person with the computer, which is me.
So it establishes a chain of trust and gives my computer a certificate and public/private key pair. Likewise, my
computer trusts the device. Now, AWS can verify a certificate the device provides. This certificate is signed by...
the computer's private key from AWS!

But we need more than just a certificate for a successful connection. For a microcontroller to talk to AWS, it 
sends and recieves messages through an MQTT client, which is a protocol like HTTP, but for sensors and
microcontrollers! To use MQTT, I installed an Arduino library for an MQTT client. 

Finally, to connect my ESP32 device to AWS IoT, I ran a simple Arduino program that made an MQTT client, which 
connected to AWS IoT. After a successful connection, it would send values from an output pin as an MQTT message to
AWS IoT. From my AWS IoT console, I could see the messages being published! YAY!

Pictures will be added later.






