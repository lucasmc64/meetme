package io.github.lucasmc64.meetme.classes;

import java.util.ArrayList;
import java.util.Iterator;

/**
 *
 * @author lucasmc64
 */

public class ScheduledEvent extends Event {
    private ArrayList<EventDate> scheduledDates;
    
    public ScheduledEvent(String name, String description, String host, ArrayList<EventDate> scheduledDates, ArrayList<String> guests) {
       super(name, description, host, guests);
       
       this.scheduledDates = scheduledDates;
    }
    
    @Override
    public EventDate findDate(String date) {
        Iterator iterator = scheduledDates.iterator();
        EventDate scheduledDate = null;
        
        while(iterator.hasNext()){
            scheduledDate = (EventDate) iterator.next();
            
            if(scheduledDate.getDate().equalsIgnoreCase(date))
                break;
            else
                scheduledDate = null;
        }
            
        return scheduledDate;
    }

    /**
     * @return the scheduledDates
     */
    public ArrayList<EventDate> getScheduledDates() {
        return scheduledDates;
    }

    /**
     * @param scheduledDates the scheduledDates to set
     */
    public void setScheduledDates(ArrayList<EventDate> scheduledDates) {
        this.scheduledDates = scheduledDates;
    }
}
