package app.web;

import app.notification.client.dto.Email;
import app.notification.client.dto.PreferenceResponse;
import app.notification.service.NotificationService;
import app.security.UserData;
import app.utils.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.List;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // 1. Browser -> Smart Wallet
    // 2. Smart Wallet -> notification-svc (Feign call)
    // 3. notification-svc return response to Smart Wallet
    // 4. Smart Wallet display the response to the Browser
    // Thin controllers --- VERY IMPORTANT!!!!
    @GetMapping
    public ModelAndView getNotificationPage(@AuthenticationPrincipal UserData user) {

        ModelAndView modelAndView = new ModelAndView("notifications");

        List<Email> userEmails = notificationService.getUserLastEmails(user.getUserId());
        modelAndView.addObject("preference", notificationService.getPreferenceByUserId(user.getUserId()));
        modelAndView.addObject("lastEmails", userEmails);
        modelAndView.addObject("nonFailedEmailsCount", EmailUtils.getNonFailedEmailsCount(userEmails));
        modelAndView.addObject("failedEmailsCount", EmailUtils.getFailedEmailsCount(userEmails));

        return modelAndView;
    }

    @PostMapping("/enable")
    public ModelAndView enableNotifications(@AuthenticationPrincipal UserData user) {
        PreferenceResponse currentPreference = notificationService.getPreferenceByUserId(user.getUserId());
        notificationService.upsertPreference(user.getUserId(), true, currentPreference.getContactInfo());
        return new ModelAndView("redirect:/notifications");
    }

    @PostMapping("/disable")
    public ModelAndView disableNotifications(@AuthenticationPrincipal UserData user) {
        PreferenceResponse currentPreference = notificationService.getPreferenceByUserId(user.getUserId());
        notificationService.upsertPreference(user.getUserId(), false, currentPreference.getContactInfo());
        return new ModelAndView("redirect:/notifications");
    }

    @PostMapping("/clear")
    public ModelAndView clearHistory(@AuthenticationPrincipal UserData user) {
        ModelAndView modelAndView = new ModelAndView("notifications");
        
        // Return empty list to clear notifications from screen
        modelAndView.addObject("preference", notificationService.getPreferenceByUserId(user.getUserId()));
        modelAndView.addObject("lastEmails", Collections.emptyList());
        modelAndView.addObject("nonFailedEmailsCount", 0L);
        modelAndView.addObject("failedEmailsCount", 0L);
        
        return modelAndView;
    }
}