import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, ChatRoom
from django.core import serializers


class ChatConsumer(WebsocketConsumer):

     def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.load_messages_to_room_group()

     def load_messages_to_room_group(self):
        all_messages = Message.objects.all()
       

        for msg in all_messages:
            # print(type(msg.user))
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'loading_chat_messages',
                    'message': msg.message,
                    'name': json.dumps(msg.user)
                }
            )
        pass

     def loading_chat_messages(self, event):
        message = event['message']
        name = event['name']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name
        }))


     def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )


    # Receive message from WebSocket
     def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        name = text_data_json['name']
        room = ChatRoom.objects.filter(room_name=text_data_json['room']).first()
        print('AAAAAAAAAAA')
        print(room)
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': name
            }
        )
        
        Message.objects.create(message=text_data_json['message'], user=text_data_json['name'], room=room)

        

    # Receive message from room group
     def chat_message(self, event):
        message = event['message']
        name = event['name']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name
        }))
        


    # def message_to_json(self,message):
    #     msg = {
    #         'message': message.message,
    #         'name': message.user,
    #         'date_time': str(message.date_time),
    #         'room': message.room
    #     }
    #     return msg

    # def messages_to_json(self,messages):
    #     json_messages =[]
    #     for msg in messages:
    #         json_messages.append(message_to_json(msg))
    #     return json_messages    

    # def fetch_messages(self,data):
    #     last_10_messages = Message.message_pagination()
    #     cont = {
    #         'command':'messages',
    #         'messages': self.messages_to_json(last_10_messages)
    #     }
    #     # print("fetch")
    #     self.send_msg_to_ws(cont)

    

    # def new_message(self,data):
    #     message = Message.objects.create(message=data['message'],user=data['name'])
    #     cont = {
    #         'command': 'new_message',
    #         'message': self.message_to_json(message)

    #     }
    #     # print("new_messageee")
    #     return self.send_chat_message(cont)  


    # commands = {
    #     'fetch_messages': fetch_messages,
    #     'new_message': new_message,
    #     # 'set_username': set_username
    # }


    # def connect(self):
    #     self.room_name = self.scope['url_route']['kwargs']['room_name']
    #     self.room_group_name = 'chat_%s' % self.room_name
    #     # Join room group
    #     async_to_sync(self.channel_layer.group_add)(
    #         self.room_group_name,
    #         self.channel_name
    #     )
    #     self.accept()

    # def disconnect(self, close_code):
    #     # Leave room group
    #     async_to_sync(self.channel_layer.group_discard)(
    #         self.room_group_name,
    #         self.channel_name
    #     )
   
    # # Receive message from WebSocket
    # def receive(self, text_data):
    #     data = json.loads(text_data)
    #     # self.commands[data['command']](self, data)
    # # Send message to room group
    # # def send_chat_message(self, message):
    #     async_to_sync(self.channel_layer.group_send)(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message
    #         }
    #     )

    # # Receive message from WebSocket
    # def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #     name = text_data_json['name']

    #     # Send message to room group
    #     async_to_sync(self.channel_layer.group_send)(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message,
    #             'name': name
    #         }
    #     )

    
    # Receive message from room group
    # def chat_message(self, event):
    #     message = event['message']
    #     # name = event['name']
    #     # Send message to WebSocket
    #     self.send(text_data=json.dumps(message))

    # def send_msg_to_ws(self,message):
    #     self.send(text_data=json.dumps(message))
