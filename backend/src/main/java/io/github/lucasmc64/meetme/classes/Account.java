package io.github.lucasmc64.meetme.classes;

import java.util.Date;

/**
 *
 * @author lucasmc64
 */

public class Account extends User {
    private Schedule schedule;
    private boolean isNewAccount;
    
    public Account(String username, String password) {
        super(username, password);
        
        this.schedule = new Schedule();
        this.isNewAccount = true;
    }

    /**
     * @return the schedule
     */
    public Schedule getSchedule() {
        return schedule;
    }

    /**
     * @param schedule the schedule to set
     */
    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    /**
     * @return the isNewAccount
     */
    public boolean getIsNewAccount() {
        return isNewAccount;
    }

    /**
     * @param isNewAccount the isNewAccount to set
     */
    public void setIsNewAccount(boolean isNewAccount) {
        this.isNewAccount = isNewAccount;
    }
}
