AWSTemplateFormatVersion: 2010-09-09
Description: Specifies a flow for an Amazon Connect instance
Resources:
  Flow:
    Type: "AWS::Connect::ContactFlow"
    Properties:
      Name: myFlow
      Description: flow created using cfn
      InstanceArn: arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21
      Type: CONTACT_FLOW
      Content: |  
        {
    "Version": "2019-10-30",
    "StartAction": "6e225ca0-6dd3-47cf-9f93-a65237ab6fbc",
    "Metadata": {
        "entryPointPosition": {
            "x": -422.4,
            "y": 0.8
        },
        "ActionMetadata": {
            "6e225ca0-6dd3-47cf-9f93-a65237ab6fbc": {
                "position": {
                    "x": -327.2,
                    "y": -22.4
                }
            },
            "400344ee-10a7-4612-917c-37492fddcb47": {
                "position": {
                    "x": -64.8,
                    "y": -21.6
                }
            },
            "98fa7ee7-41c7-4924-a2b2-cf8a50ecfbf9": {
                "position": {
                    "x": 180,
                    "y": -33.6
                }
            },
            "edf9c9a9-7e72-4d37-a934-231ba00766dc": {
                "position": {
                    "x": 448.8,
                    "y": -88
                }
            },
            "5997490e-b27d-49f3-90c7-b21cdcc90a94": {
                "position": {
                    "x": 1257.6,
                    "y": 78.4
                }
            },
            "ErrorMessage": {
                "position": {
                    "x": 819.2,
                    "y": 283.2
                },
                "isFriendlyName": true
            },
            "24c5633c-9030-459e-8a65-17cf52a5a17a": {
                "position": {
                    "x": 710.4,
                    "y": -85.6
                },
                "parameters": {
                    "QueueId": {
                        "displayName": "BasicQueue"
                    }
                },
                "queue": {
                    "text": "BasicQueue"
                }
            },
            "c287698e-3aff-482e-8dd9-e99c9d7ec0f5": {
                "position": {
                    "x": 967.2,
                    "y": -73.6
                }
            }
        },
        "Annotations": [],
        "name": "wipo-live-chat-test",
        "description": "Custom Lex UI and Live Chat Handoff",
        "type": "contactFlow",
        "status": "PUBLISHED",
        "hash": {}
    },
    "Actions": [
        {
            "Parameters": {
                "FlowLoggingBehavior": "Enabled"
            },
            "Identifier": "6e225ca0-6dd3-47cf-9f93-a65237ab6fbc",
            "Type": "UpdateFlowLoggingBehavior",
            "Transitions": {
                "NextAction": "400344ee-10a7-4612-917c-37492fddcb47"
            }
        },
        {
            "Parameters": {
                "RecordingBehavior": {
                    "RecordedParticipants": [
                        "Agent",
                        "Customer"
                    ]
                },
                "AnalyticsBehavior": {
                    "Enabled": "True",
                    "AnalyticsLanguage": "en-US",
                    "AnalyticsRedactionBehavior": "Disabled",
                    "AnalyticsRedactionResults": "RedactedAndOriginal",
                    "ChannelConfiguration": {
                        "Chat": {
                            "AnalyticsModes": [
                                "ContactLens"
                            ]
                        },
                        "Voice": {
                            "AnalyticsModes": [
                                "RealTime"
                            ]
                        }
                    }
                }
            },
            "Identifier": "400344ee-10a7-4612-917c-37492fddcb47",
            "Type": "UpdateContactRecordingBehavior",
            "Transitions": {
                "NextAction": "98fa7ee7-41c7-4924-a2b2-cf8a50ecfbf9"
            }
        },
        {
            "Parameters": {
                "Text": "Hello, Thanks for reaching to WIPO HelpDesk.  You will be connected with live agent soon... "
            },
            "Identifier": "98fa7ee7-41c7-4924-a2b2-cf8a50ecfbf9",
            "Type": "MessageParticipant",
            "Transitions": {
                "NextAction": "edf9c9a9-7e72-4d37-a934-231ba00766dc",
                "Errors": [
                    {
                        "NextAction": "ErrorMessage",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        {
            "Parameters": {
                "Text": "Transfering the call to agent"
            },
            "Identifier": "edf9c9a9-7e72-4d37-a934-231ba00766dc",
            "Type": "MessageParticipant",
            "Transitions": {
                "NextAction": "24c5633c-9030-459e-8a65-17cf52a5a17a",
                "Errors": [
                    {
                        "NextAction": "ErrorMessage",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        {
            "Parameters": {},
            "Identifier": "5997490e-b27d-49f3-90c7-b21cdcc90a94",
            "Type": "DisconnectParticipant",
            "Transitions": {}
        },
        {
            "Parameters": {
                "Text": "Facing Technical Issue. Please try after somtime to connect with us "
            },
            "Identifier": "ErrorMessage",
            "Type": "MessageParticipant",
            "Transitions": {
                "NextAction": "5997490e-b27d-49f3-90c7-b21cdcc90a94",
                "Errors": [
                    {
                        "NextAction": "5997490e-b27d-49f3-90c7-b21cdcc90a94",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        {
            "Parameters": {
                "QueueId": "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21/queue/f8c742b9-b5ef-4948-8bbf-9a33c892023f"
            },
            "Identifier": "24c5633c-9030-459e-8a65-17cf52a5a17a",
            "Type": "UpdateContactTargetQueue",
            "Transitions": {
                "NextAction": "c287698e-3aff-482e-8dd9-e99c9d7ec0f5",
                "Errors": [
                    {
                        "NextAction": "ErrorMessage",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        {
            "Parameters": {},
            "Identifier": "c287698e-3aff-482e-8dd9-e99c9d7ec0f5",
            "Type": "TransferContactToQueue",
            "Transitions": {
                "NextAction": "ErrorMessage",
                "Errors": [
                    {
                        "NextAction": "5997490e-b27d-49f3-90c7-b21cdcc90a94",
                        "ErrorType": "QueueAtCapacity"
                    },
                    {
                        "NextAction": "ErrorMessage",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        }
    ]
}
