package io.github.lucasmc64.meetme.classes;

import java.util.ArrayList;
import java.util.Iterator;

/**
 *
 * @author lucasmc64
 */

public class UnscheduledEvent extends Event {
    private ArrayList<EventDate> possibleDates;
    
    public UnscheduledEvent(String name, String description, String host, ArrayList<EventDate> possibleDates, ArrayList<String> guests) {
       super(name, description, host, guests);
       
       this.possibleDates = possibleDates;
    }
    
    @Override
    public EventDate findDate(String date) {
        Iterator iterator = possibleDates.iterator();
        EventDate possibleDate = null;
        
        while(iterator.hasNext()){
            possibleDate = (EventDate) iterator.next();
            
            if(possibleDate.getDate().equalsIgnoreCase(date))
                break;
            else
                possibleDate = null;
        }
            
        return possibleDate;
    }
    
    /**
     * @return the possibleDates
     */
    public ArrayList<EventDate> getPossibleDates() {
        return possibleDates;
    }

    /**
     * @param possibleDates the possibleDates to set
     */
    public void setPossibleDates(ArrayList<EventDate> possibleDates) {
        this.possibleDates = possibleDates;
    }
}
