package io.github.lucasmc64.meetme.classes;

import java.util.ArrayList;
import java.util.Iterator;

/**
 *
 * @author lucasmc64
 */

public class Schedule {
    private ArrayList<ScheduledEvent> scheduledEvents;
    private ArrayList<UnscheduledEvent> unscheduledEvents;
    
    public Schedule() {
        this.scheduledEvents = new ArrayList();
        this.unscheduledEvents = new ArrayList();
    }
    
    public boolean createEvent(UnscheduledEvent unscheduledEvent) {
        getUnscheduledEvents().add(unscheduledEvent);
        
        return true;
    }
    
    public boolean deleteUnscheduledEvent(String eventName) {
        int eventIndex;
        
        for(eventIndex = 0; eventIndex < getUnscheduledEvents().size(); eventIndex++) {
            if(getUnscheduledEvents().get(eventIndex).getName().equals(eventName))
                break;
        }
        
        if(eventIndex >= getUnscheduledEvents().size())
            return false;
        
        getUnscheduledEvents().remove(eventIndex);
        
        return true;
    }
    
    public boolean deleteScheduledEvent(String eventName) {
        int eventIndex;
        
        for(eventIndex = 0; eventIndex < getScheduledEvents().size(); eventIndex++) {
            if(getScheduledEvents().get(eventIndex).getName().equals(eventName))
                break;
        }
        
        if(eventIndex >= getScheduledEvents().size())
            return false;
        
        getScheduledEvents().remove(eventIndex);
        
        return true;
    }
    
    public boolean updateUnscheduledEvent(String username, String eventName, UnscheduledEvent updatedEvent) {
        UnscheduledEvent event = findUnscheduledEvent(eventName);

        if(event == null) {
            unscheduledEvents.add(updatedEvent);
        } else {
            event.setName(updatedEvent.getName());
            event.setDescription(updatedEvent.getDescription());
            event.setGuests(updatedEvent.getGuests());

            if(event.getHost().equals(username)) {
                event.setPossibleDates(updatedEvent.getPossibleDates());
            } else {
                ArrayList<EventDate> updatedPossibleDates = new ArrayList();

                Iterator iterator = updatedEvent.getPossibleDates().iterator();

                while(iterator.hasNext()) {
                    EventDate newPossibleDate = (EventDate) iterator.next();
                    EventDate possibleDate = event.findDate(newPossibleDate.getDate());

                    if(possibleDate != null && newPossibleDate.getTimetables().size() == 0) {
                        updatedPossibleDates.add(possibleDate);
                    } else {
                        updatedPossibleDates.add(newPossibleDate);
                    }  
                }

                event.setPossibleDates(updatedPossibleDates);
            }
        }
        
        return true;
    }
    
    public boolean updateScheduledEvent(String eventName, ScheduledEvent updatedEvent) {
        ScheduledEvent event = findScheduledEvent(eventName);
        
        if(event == null) {
            scheduledEvents.add(updatedEvent);
        } else {
            event.setName(updatedEvent.getName());
            event.setDescription(updatedEvent.getDescription());
            event.setGuests(updatedEvent.getGuests());
            event.setScheduledDates(updatedEvent.getScheduledDates());
        }
        
        return true;
    }
    
    public boolean scheduleEvent(String eventName, ScheduledEvent updatedEvent) {
        boolean confirmDeletion = deleteUnscheduledEvent(eventName);
        
        if(!confirmDeletion)
            return false;
        
        getScheduledEvents().add(updatedEvent);
        
        return true;
    }
    
    /**
     * @return search for a scheduled event
     */
    public ScheduledEvent findScheduledEvent(String eventName) {
        Iterator iterator = getScheduledEvents().iterator();
        ScheduledEvent event = null;
        
        while(iterator.hasNext()){
            event = (ScheduledEvent) iterator.next();
            
            if(event.getName().equals(eventName))
                break;
            else
                event = null;
        }
            
        return event;
    }
    
    /**
     * @return search for a unscheduled event
     */
    public UnscheduledEvent findUnscheduledEvent(String eventName) {
        Iterator iterator = getUnscheduledEvents().iterator();
        UnscheduledEvent event = null;
        
        while(iterator.hasNext()){
            event = (UnscheduledEvent) iterator.next();

            if(event.getName().equals(eventName))
                break;
            else
                event = null;
        }
            
        return event;
    }

    /**
     * @return the scheduledEvents
     */
    public ArrayList<ScheduledEvent> getScheduledEvents() {
        return scheduledEvents;
    }

    /**
     * @param scheduledEvents the scheduledEvents to set
     */
    public void setScheduledEvents(ArrayList<ScheduledEvent> scheduledEvents) {
        this.scheduledEvents = scheduledEvents;
    }

    /**
     * @return the unscheduledEvents
     */
    public ArrayList<UnscheduledEvent> getUnscheduledEvents() {
        return unscheduledEvents;
    }

    /**
     * @param unscheduledEvents the unscheduledEvents to set
     */
    public void setUnscheduledEvents(ArrayList<UnscheduledEvent> unscheduledEvents) {
        this.unscheduledEvents = unscheduledEvents;
    }
}
