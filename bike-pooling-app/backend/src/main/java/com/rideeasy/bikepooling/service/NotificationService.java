package com.rideeasy.bikepooling.service;

import com.rideeasy.bikepooling.model.Notification;
import com.rideeasy.bikepooling.model.User;
import com.rideeasy.bikepooling.repository.NotificationRepository;
import com.rideeasy.bikepooling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void sendNotification(User recipient, String message, String type) {
        Notification notification = new Notification(recipient, message, type);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientOrderByTimestampDesc(user);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
