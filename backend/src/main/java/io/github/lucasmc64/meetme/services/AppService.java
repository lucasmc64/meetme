package io.github.lucasmc64.meetme.services;

import io.github.lucasmc64.meetme.classes.Account;
import io.github.lucasmc64.meetme.classes.Event;
import io.github.lucasmc64.meetme.classes.EventDate;
import io.github.lucasmc64.meetme.classes.Schedule;
import io.github.lucasmc64.meetme.classes.ScheduledEvent;
import io.github.lucasmc64.meetme.classes.UnscheduledEvent;
import java.util.ArrayList;
import java.util.Iterator;
import org.springframework.stereotype.Service;

/**
 *
 * @author lucasmc64
 */
@Service
public class AppService {
    private ArrayList<Account> accounts;
    
    public AppService() {
        accounts = new ArrayList();
    }

    public boolean login(String username, String password) {
        Account account = this.findAccount(username);

        if (account == null) {
            return this.createAccount(username, password);
        }

        if (account.getIsNewAccount()) {
            account.setIsNewAccount(false);
        }

        return account.getPassword().equals(password);
    }

    public boolean createAccount(String username, String password) {
        accounts.add(new Account(username, password));
        return true;
    }

    /**
     * @return the account
     */
    public Account findAccount(String username) {
        Iterator iterator = accounts.iterator();
        Account account = null;

        while (iterator.hasNext()) {
            account = (Account) iterator.next();

            if (account.getUsername().equals(username)) {
                break;
            } else {
                account = null;
            }
        }

        return account;
    }

    /**
     * @return the accounts
     */
    public ArrayList<Account> getAllAccounts() {
        return accounts;
    }

    /**
     * @return all the accounts usernames
     */
    public ArrayList<String> getAllAccountsUsernames() {
        Iterator iterator = accounts.iterator();
        Account account = null;
        ArrayList<String> accountsUsernames = new ArrayList();

        while (iterator.hasNext()) {
            account = (Account) iterator.next();

            accountsUsernames.add(account.getUsername());
        }

        return accountsUsernames;
    }

    /**
     * @return the event
     */
    public Event findEvent(String username, String eventName) {
        Account account = this.findAccount(username);

        if (account == null) {
            return null;
        }

        Event event = null;

        event = account.getSchedule().findUnscheduledEvent(eventName);

        if (event == null) {
            event = account.getSchedule().findScheduledEvent(eventName);
        }

        return event;
    }

    public boolean createEvent(String username, UnscheduledEvent unscheduledEvent) {
        Account account = this.findAccount(username);

        if (account == null) {
            return false;
        }

        account.getSchedule().createEvent(unscheduledEvent);

        return true;
    }

    public boolean deleteEvent(String username, String eventName) {
        Account account = this.findAccount(username);

        if (account == null) {
            return false;
        }

        boolean confirmDeletion = false;

        confirmDeletion = account.getSchedule().deleteUnscheduledEvent(eventName);

        if (confirmDeletion) {
            return true;
        }

        confirmDeletion = account.getSchedule().deleteScheduledEvent(eventName);

        return confirmDeletion;
    }

    public boolean updateScheduledEvent(String username, String eventName, ScheduledEvent updatedEvent) {
        Account account = this.findAccount(username);

        if (account == null) {
            return false;
        }

        return account.getSchedule().updateScheduledEvent(eventName, updatedEvent);
    }
    
    public boolean updateUnscheduledEvent(String username, String eventName, UnscheduledEvent updatedEvent) {
        Account account = this.findAccount(username);

        if (account == null) {
            return false;
        }

        return account.getSchedule().updateUnscheduledEvent(username, eventName, updatedEvent);
    }

    public boolean scheduleEvent(String username, String eventName, ScheduledEvent updatedEvent) {
        Account account = this.findAccount(username);

        if (account == null) {
            return false;
        }

        boolean confirmSchedule = account.getSchedule().scheduleEvent(eventName, updatedEvent);

        return confirmSchedule;
    }

    public ArrayList<EventDate> getAllPossibleDates(String eventName, ArrayList<String> allPresent) {
        ArrayList<EventDate> allPossibleDates = new ArrayList();
        
        Iterator iterator = allPresent.iterator();

        while (iterator.hasNext()) {
            String guest = (String) iterator.next();
            Account account = findAccount(guest);

            UnscheduledEvent event = account.getSchedule().findUnscheduledEvent(eventName);

            allPossibleDates.addAll(event.getPossibleDates());
        }

        return allPossibleDates;
    }
}
