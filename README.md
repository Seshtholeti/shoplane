import json
import boto3 
# import os
# from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
from botocore.exceptions import ClientError
def lambda_handler(event, context):
    # anthropic=Anthropic(
    #     api_key=os.environ["ANTHROPIC_API_KEY"]  
    # )
    print(event['body'])
    body = json.loads(event['body'])
    print(body)
    if body["intent"]=='dropDown':
        aa=['promotional', 'informational', 'offer on products']
        return aa
    if body["intent"]=='email':         
        # bedrock = boto3.client(service_name='bedrock', region_name='us-west-2')
        # bedrock =boto3.client(service_name='bedrock',region_name='us-west-2', endpoint_url="https://bedrock-runtime.us-west-2.amazonaws.com")
        bedrock_runtime=boto3.client(service_name='bedrock-runtime',region_name='us-west-2',endpoint_url="https://bedrock-runtime.us-west-2.amazonaws.com")
        print("Runtime : ",bedrock_runtime)

        email_type = body['email_type'] 
        email_lang = body['email_lang']
        email_words = body['email_words']
        user_prompt = body['user_prompt']
        prompt_data="Human: Conversation Transcript:Generate an "+email_type+" email on "+user_prompt+" with maximum "+email_words+" words in "+email_lang+" language\n\n\n\nAssistant:"
        
        # prompt_data="Generate an "+email_type+" email on "+user_prompt+" with maximum "+email_words+" words in "+email_lang+" language"
        # prompt_data = f"Task: Develop a comprehensive email template.Category: '{email_type}',Subject: '{user_prompt}',Language: {email_lang},Word Count: Aim for approximately {email_words} words.Ensure the content reflects a professional tone and conveys the intended message effectively.Finally Translate the email to French laNGUAGE"
        # prompt_data='generate an email with category '+email_type+' containing '+email_words+' words in '+email_lang+',an email should contain  description like  '+user_prompt+'...'
        # prompt_data = f"Write a email of Template category will be '{email_type}',subject will be '{user_prompt}',in a word count of approximately {email_words} words.Ensure the content reflects a professional tone and conveys the intended message effectively. write the email in '{email_lang}' language"
        print('new',prompt_data)
        # prompt_data1="I need to send email in hindi for all the employees about the health checkup happening in the office from 10th jan to 17th jan"+"\n From the above prompt please create a mail content in 300 words in hindi laNGUAGE to be used as a email content"
        modelId = 'amazon.titan-text-express-v1'
        # modelId = 'anthropic.claude-v2'
        body = json.dumps({"inputText": prompt_data,"textGenerationConfig":{"maxTokenCount":400,"stopSequences":[],"temperature":0,"topP":1}})
        # body = json.dumps({"prompt": prompt_data, "max_tokens_to_sample": 350, "temperature":1,"top_k":250,"top_p":0.999,"anthropic_version":"bedrock-2023-05-31"})
        accept = 'application/json'
        contentType = 'application/json'
        response = bedrock_runtime.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)
        
            ###----Boto3 client connection with AWS Bedrock----###

        response_body = json.loads(response.get('body').read())
        print("response_body",response_body)
        Summary_response =(response_body.get('results')[0].get('outputText'))
        print("Summary_response",Summary_response)
        # Final_Response=response_body.get('completion')
        # print("Final_Response",Final_Response)
        # return Final_Response
        
        
    # completion=anthropic.completions.create(
    #     model="claude-2",
    #     max_tokens_to_sample=300,
    #     prompt=f"{HUMAN_PROMPT}+prompt_data+{AI_PROMPT}"
    # )
    # print("Output Result : ",completion.completion)
        return Summary_response

    
