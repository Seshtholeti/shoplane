curl -X POST \
  'https://graph.instagram.com/v21.0/me/messages' \
  -H 'Authorization: Bearer IGAAM561vck1ZABZAE9iNGZAHR1hZAX25zYWx3MVdMU2w5bGMtbmMtQnJreXpaOFZA2R1BiMXhlNTVLeUhlVTdmNEJGNGM5Q1VlVWcyZA2pLdzF5UFc2OUw1NDRMRUNPSE82a0JTZA1ROV3pSVlIxLURLOHpaX0V1ZAjQyU2RsQ3FMQzdkUQZDZD' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "{\"text\":\"Hello World\"}",
    "recipient": "{\"id\":\"\"}"
  }'
