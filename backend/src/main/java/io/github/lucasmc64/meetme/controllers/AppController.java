package io.github.lucasmc64.meetme.controllers;

import io.github.lucasmc64.meetme.classes.Account;
import io.github.lucasmc64.meetme.classes.Event;
import io.github.lucasmc64.meetme.classes.EventDate;
import io.github.lucasmc64.meetme.classes.Response;
import io.github.lucasmc64.meetme.classes.ScheduledEvent;
import io.github.lucasmc64.meetme.classes.UnscheduledEvent;
import io.github.lucasmc64.meetme.classes.User;
import io.github.lucasmc64.meetme.services.AppService;
import java.util.ArrayList;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author lucasmc64
 */

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class AppController {
    private AppService app;
    
    public AppController() {
        app = new AppService();
    }
    
    @RequestMapping(value = "/login", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response login(@RequestBody User user) {
        boolean confirmLogin = app.login(user.getUsername(), user.getPassword());
        
        if(!confirmLogin)
            return new Response(false, "Senha incorreta.");
        
        Account account = app.findAccount(user.getUsername());

        return new Response(account.getIsNewAccount());
    }
    
    @RequestMapping(value = "/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response getAllAccountsUsernames() {
        return new Response(app.getAllAccountsUsernames());
    }
    
    @RequestMapping(value = "/login/{username}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response autoLogin(@PathVariable("username") String username) {
        Account account = app.findAccount(username);
        
        if(account == null)
            return new Response(false, "Usuário não cadastrado no sistema.");
        
        return new Response(account.getIsNewAccount());
    }
    
    @RequestMapping(value = "/users/{username}/schedule/event/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response createEvent(@PathVariable("username") String username, @RequestBody UnscheduledEvent unscheduledEvent) {
        Event event = app.findEvent(username, unscheduledEvent.getName());
        
        if(event != null)
            return new Response(false, "Evento de mesmo nome já cadastrado no sistema.");
        
        boolean confirmCreation = app.createEvent(username, unscheduledEvent);
        
        if(!confirmCreation)
            return new Response(false, "Usuário não cadastrado no sistema.");

        return new Response();
    }
    
    @RequestMapping(value = "/users/{username}/schedule", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response getSchedule(@PathVariable("username") String username) {
        Account account = app.findAccount(username);
        
        if(account == null)
            return new Response(false, "Usuário não cadastrado no sistema.");
        
        return new Response(account.getSchedule());
    }
    
    @RequestMapping(value = "/users/{username}/schedule/event/delete/{eventName}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response deleteEvent(@PathVariable("username") String username, @PathVariable("eventName") String eventName) {
        Event event = app.findEvent(username, eventName);
        
        if(event == null)
            return new Response(false, "Evento não existe para o usuário informado.");
        
        boolean confirmDeletion = app.deleteEvent(username, eventName);
        
        if(!confirmDeletion)
            return new Response(false, "Houve algum erro ao tentar deletar o evento.");

        return new Response();
    }
    
    @RequestMapping(value = "/users/{username}/schedule/unscheduledEvents/event/update/{eventName}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response updateUnscheduledEvent(@PathVariable("username") String username, @PathVariable("eventName") String eventName, @RequestBody UnscheduledEvent updatedEvent) {
        boolean confirmUpdate = app.updateUnscheduledEvent(username, eventName, updatedEvent);
        
        if(!confirmUpdate)
            return new Response(false, "Evento não existe para o usuário informado.");

        return new Response();
    }
    
    @RequestMapping(value = "/users/{username}/schedule/scheduledEvents/event/update/{eventName}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response updateScheduledEvent(@PathVariable("username") String username, @PathVariable("eventName") String eventName, @RequestBody ScheduledEvent updatedEvent) {
        boolean confirmUpdate = app.updateScheduledEvent(username, eventName, updatedEvent);
        
        if(!confirmUpdate)
            return new Response(false, "Evento não existe para o usuário informado.");

        return new Response();
    }
    
    @RequestMapping(value = "/users/{username}/schedule/event/toSchedule/{eventName}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response scheduleEvent(@PathVariable("username") String username, @PathVariable("eventName") String eventName, @RequestBody ScheduledEvent updatedEvent) {
        Event event = app.findEvent(username, eventName);
        
        if(event == null)
            return new Response(false, "Evento não existe para o usuário informado.");
        
        boolean confirmSchedule = app.scheduleEvent(username, eventName, updatedEvent);
        
        if(!confirmSchedule)
            return new Response(false, "Houve algum erro ao tentar atualizar o evento.");

        return new Response();
    }
    
    @RequestMapping(value = "/users/schedule/event/timetables/{eventName}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response getAllPossibleDates(@PathVariable("eventName") String eventName, @RequestBody ArrayList<String> allPresent) {  
        ArrayList<EventDate> possibleDates = app.getAllPossibleDates(eventName, allPresent);
        
        if(possibleDates.size() == 0)
            return new Response(false, "Evento não existe para nenhum usuário informado.");

        return new Response(possibleDates);
    }
}
