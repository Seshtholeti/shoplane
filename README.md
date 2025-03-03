Servicing Customers on Social Messenger Channels via Amazon Connect Chat
by Blesson Gregory and Gaurav Arora on 04 JUN 2021 in Amazon Connect, Amazon Machine Learning, AWS Partner Network, Customer Solutions, Intermediate (200) Permalink  Comments  Share
By Blesson Gregory, Cognitive Technologies Lead at TCS
By Gaurav Arora, Sr. Partner Solutions Architect at AWS

TCS-AWS-Partners-1
According to a customer study conducted by Gartner in 2021, 80 percent of customer service organizations will abandon native mobile apps in favor of messaging by 2025.

This prediction is based on the global popularity gained by third-party messaging apps such as Facebook Messenger, WeChat, and WhatsApp.

Customers want to choose the channels through which they interact with their service providers, and they want those organizations to recognize them and remember their previous interactions across all engagement channels.

Amazon Connect is an easy-to-use cloud contact center platform that helps enterprises provide superior customer service at a lower cost. As a platform catering to evolving needs of the customer, Amazon Connect supports voice and web chat as channels.

As most companies want social media channels serviced by their contact center agents, introducing social messenger channels into Amazon Connect is important. This includes private, one-on-one social media channels—including Twitter, Facebook Messenger, and WhatsApp—handled via the Amazon Connect web chat channel.

Tata Consultancy Services (TCS) is an AWS Premier Consulting Partner with the Amazon Connect service delivery designation that has built an adapter that can pick up the customer queries from social messenger channels and bring them into the web chat channel of Amazon Connect.

This post describes the high-level architecture of the TCS solution, potential benefits, and ways to extend the solution to leverage other AWS services.

Solution Overview
The TCS solution establishes two-way communication between contact center agents and customers on social messenger channels, leveraging Amazon Connect as the underlying platform. This helps avoid costly plug-ins or complementary solutions that must be used otherwise for contact center agents to service these channels.

TCS-Social-Messenger-Connect-1

Figure 1 – Key building blocks of the TCS solution.

Key services in this solution include Amazon Lex for building conversational interfaces into any application using voice and text; Amazon Polly for turning text into lifelike speech; Amazon Transcribe for converting speech to text quickly and accurately; and Amazon Comprehend, a natural language processing (NLP) service that uses machine learning (ML) to find insights and relationships in text.

Solution Architecture
The high-level architecture diagram below outlines flow of customer interaction events with source being social messenger channels, and the destination being interactions served from Amazon Connect.

TCS-Social-Messenger-Connect-2

Figure 2 – High level architecture of the TCS solution.

The customer uses their own account to send a message to their service provider’s official Twitter, Facebook, or WhatsApp account using Twitter Direct Messages, Facebook Messenger, or WhatsApp, respectively.
.
WhatsApp service integration is provided through Twilio, an AWS ISV Partner and cloud communications platform that enables developers to programmatically make and receive phone calls, send and receive text messages, and perform other functions using web service APIs.
.
Webhooks are created and authenticated for each social messenger channel to forward incoming messages to the service provider’s social messenger accounts. These accounts (Twitter or Facebook) are connected to their respective webhooks hosted in AWS Lambda, whereas WhatsApp is connected to a Twilio webhook hosted in Lambda.
.
Twitter, Facebook, and WhatsApp (Twilio-enabled) webhooks send these event objects to the orchestrator web application endpoint hosted on Amazon Elastic Compute Cloud (Amazon EC2). The EC2 server receives the post request sent by webhooks, and multi-Availability Zone (AZ) deployment is adopted for the EC2 servers to ensure reliability and availability.
.
Other services are consumed as platform-as-a-service (PaaS), thereby leveraging their built-in reliability and availability. All communication is done using HTTPS, including a discretionary SSL (TLS) certificate validation to enforce validation on webhooks.
.
A new connection with Amazon Connect is established for each customer interaction by opening a new web socket connection between an EC2-based web application and AWS. The connection is linked to a specific Amazon Connect Contact Flow.
.
Messages sent by customers from respective channels are sent to Amazon Connect, where an agent receives the message on Amazon Connect Contact Control Panel (CCP). The agent responds to the customer and sends a reply, captured from the respective web socket.
.
Twitter, Facebook, and WhatsApp (Twilio-enabled) SDKs are used to send this captured agent message to respective customer channels using the credentials and authorization tokens of official company accounts. All messages are reflected in the company’s official account chat window.
.
The solution leverages native security features of Amazon Connect, including role-based access for both agents and integrating application, use of multi-factor authentication (especially for admin tasks), integration with corporate directory via AWS Directory Service, and logging and monitoring to build alerts and notifications.
The solution enables multi-user sessions to be maintained simultaneously, including multiple users from the same channel such as WhatsApp. Amazon Connect routing capabilities can be leveraged to direct incoming messages to the appropriate agent groups based on their skills and availability roaster.

The solution adopts a serverless approach wherever possible while leveraging AWS managed services like Lambda, Amazon Lex, and Amazon Comprehend. The entire solution is consumed in a pay-as-you-go model, enabling cost efficiency and flexibility for the service provider.

TCS-Social-Messenger-Connect-3

Figure 3 – Two-way communication using Amazon Connect CCP.

Extend AWS Cognitive Services to Social Messenger Channels
Once the incoming customer messages enter Amazon Connect contact flows, AWS customer engagement and ML services can be deployed for automation and sentiment analytics (7).

Amazon Lex can be used to provide automated responses based on the detected intent, and Amazon Comprehend can track the sentiment of the customer. These functionalities become available on the social messenger channels as well, instead of just the voice and webchat channels.

Retain Omni-Channel Context Using Unique IDs in Each Channel
Each of the social messengers provides unique IDs which can be used to identify customers: userhandle for Twitter, userid for Facebook Messenger, and phone number for WhatsApp service.

The chat transcripts for the customers for each channel and session of interaction can be stored in Amazon DynamoDB (or a database within the company’s environment) to retain context across various customer service channels (8).

Deflection Strategies Extended to Social Messenger Channels
Many contact centers prefer to deflect their voice calls (which is typically expensive) to chat channels (which are relatively cost efficient). These deflection strategies can be extended to social messenger channels, thereby providing more choice to the customer that result in improved customer satisfaction.

If the call waiting times are high, for example, a voice bot on Amazon Connect contact flow can allow customer to move to webchat or social messenger channels to continue the interaction.

A Lambda function triggers a message to the preferred social messenger channel of the customer (9). The customer response is then captured and sent to the agents through a previously established sequence (1) – (5).

Extensibility
While the TCS solution incorporates use cases covering Twitter Direct Messages, Facebook Messenger, and WhatsApp channels, the architecture can be extended to other channels like SMS, Telegram, and LINE.

Many social messenger channels provide support for webhooks to which incoming messages can be forwarded to. This solution architecture can therefore be potentially replicated and extended to other channels as required.

Benefits
The TCS solution avoids the need for complementary solutions or plug-ins to be integrated with Amazon Connect to service social messenger channels. This feature results in potential cost savings in licenses for the overall solution.

The routing queues/logic and agent profiles can be maintained on a single platform (Amazon Connect) for voice, webchat, and social messenger channels. This reduces implementation and maintenance complexities, and provides a seamless experience for contact center agents and customers.

AWS customer engagement services being used in the voice and webchat channels can be extended to social messengers as well, helping enterprises consolidate their customer self-service automation solutions.

Conclusion
The social messenger channel integration outlined in this post extends the omni-channel capabilities of Amazon Connect. The architecture presented by TCS helps improve customer experience while helping services providers reduce licensing costs.

We live in a world where customer preferences are evolving and the inclination for social messenger channels is rising. This solution helps service providers respond to the demands of their end customers.

TCS has a proven record of delivering industry-leading contact center solutions, with associates who are trained and certified in implementing custom Amazon Connect contact centers. Contact TCS to learn more about their experience consulting with Amazon Connect.
