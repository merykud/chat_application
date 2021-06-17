from django.db import models
from django.db.models.deletion import CASCADE


# class User(models.Model):
#     username = models.CharField(max_length=30)

    # def __str__(self):
    #     return self.username


class ChatRoom(models.Model):
    room_name=models.CharField(max_length=30)

    def __str__(self):
        return self.room_name    


class Message(models.Model):
    message = models.CharField(max_length=500)
    user = models.CharField(max_length=30)
    date_time = models.DateTimeField(auto_now_add=True)
    room= models.ForeignKey(ChatRoom, on_delete=models.CASCADE)  

    def __str__(self):
        return self.message 

   


