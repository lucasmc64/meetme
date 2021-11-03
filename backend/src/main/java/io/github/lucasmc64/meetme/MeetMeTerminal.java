package io.github.lucasmc64.meetme;

import io.github.lucasmc64.meetme.classes.Account;
import io.github.lucasmc64.meetme.classes.EventDate;
import io.github.lucasmc64.meetme.classes.EventTimetable;
import io.github.lucasmc64.meetme.classes.UnscheduledEvent;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 *
 * @author lucasmc64
 */

public class MeetMeTerminal {
    static Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        ArrayList<Account> accounts = new ArrayList();
        
        Account loggedAccount = null;
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/uuuu");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        int option;
        
        System.out.printf("\n\n============================");
        System.out.printf("\n========== MeetMe ==========\n");
        System.out.printf("============================\n\n");
        
        do {
            // Login
            while(loggedAccount == null) {
                printMenuTitle("Login");
                
                System.out.println("CUIDADO: Caso queira criar um novo usuário, tanto o nome de usuário quanto a senha NÂO devem possuir espaços.\n");
                
                // Username
                String loginUsername = mandatoryStringInput("Nome de usuário: ", "Por favor, insira seu nome de usuário.", false);
                
                Iterator usersLoginIterator = accounts.iterator();
                Account matchedAccount = null;
                while(usersLoginIterator.hasNext()) {
                    Account tempAccount = (Account) usersLoginIterator.next();
                    
                    if(tempAccount.getUsername().equals(loginUsername))
                        matchedAccount = tempAccount;
                }
                
                // Account exists?
                if(matchedAccount == null) {
                    System.out.println("Não foi encontrado ninguém com esse nome de usuário. Um novo usuário será criado.");
                    
                    if(!confirm("Deseja continuar?")) {
                        System.out.println("Abortando login com esse usuário.");
                        continue;
                    }  
                }
                
                // Password
                String loginPassword = mandatoryStringInput("Senha: ", "Por favor, insira a senha correta.", false);
                
                if(matchedAccount != null && matchedAccount.getPassword().equals(loginPassword)) {
                    loggedAccount = matchedAccount;
                    
                    if(loggedAccount.getIsNewAccount())
                        loggedAccount.setIsNewAccount(false);
                    
                    System.out.printf("%s logado com sucesso!", loginUsername);
                } else {
                    Account newUser = loggedAccount = new Account(loginUsername, loginPassword);
                    accounts.add(newUser);
                    
                    System.out.printf("Seja bem vindo %s!", loginUsername);
                }
            }
            
            // Main application menu
            printMenuTitle("Menu");
            System.out.println("1) Visualizar agenda");
            System.out.println("2) Visualizar evento");
            System.out.println("3) Criar evento");
            System.out.println("4) Agendar evento");
            System.out.println("5) Logout");
            System.out.println("6) Finalizar aplicação");
            System.out.print("\n> ");
            option = scanner.nextInt();
            scanner.nextLine(); // Just to clear buffer
            
            switch(option) {
                case 1:
                    
                    break;
                case 2:
                    
                    break;
                case 3:
                    /*
                    printSubtitle("Detalhes do evento");
                    
                    System.out.print("Nome / Título: ");
                    String creationEventName = scanner.nextLine();
                    
                    System.out.print("Descrição: ");
                    String creationEventDescription = scanner.nextLine();
                    
                    ArrayList<String> creationGuestsUsernames = new ArrayList();
                    
                    do {
                        System.out.printf("Convidado %d: ", creationGuestsUsernames.size() + 1);
                        String creationGuestUsername = scanner.nextLine();
                        
                        Iterator accountsGuestsIterator = accounts.iterator();
                        boolean creationAccountExists = false;
                        while(accountsGuestsIterator.hasNext()) {
                            Account tempAccount = (Account) accountsGuestsIterator.next();

                            if(tempAccount.getUsername().equals(creationGuestUsername))
                                creationAccountExists = true;
                        }

                        // Account exists?
                        if(!creationAccountExists) {
                            System.out.println("Não foi encontrado ninguém com esse nome de usuário.");
                            continue; 
                        }
                        
                        creationGuestsUsernames.add(creationGuestUsername);
                    } while(creationGuestsUsernames.size() > 0 && confirm("Deseja adicionar outro convidado?"));
                    
                    // The available times are relative to who is currently logged in, so this information shouldn't be stored in other people's event objects and, to avoid looping this data in the future, I just paid the price of wasting more memory.
                    ArrayList<EventDate> creationPossibleDatesCreator = new ArrayList();
                    ArrayList<EventDate> creationPossibleDatesGuest = new ArrayList();
                    
                    do {
                        LocalDate creationPossibleDateConverted;
                        String creationPossibleDate = "";
                        boolean isAValidDate = false;
                        
                        do {
                            try {
                                System.out.printf("Data %d (dd/mm/yyyy): ", creationGuestsUsernames.size() + 1);
                                creationPossibleDate = scanner.nextLine();
                                
                                isAValidDate = validateStrDate(creationPossibleDate);
                                
                                if(!isAValidDate)
                                    throw new RuntimeException("Formato de data inválida. Tente novamente...");
                                
                                creationPossibleDateConverted = LocalDate.parse(creationPossibleDate, dateFormatter);
                                
                                
                                // TERMINAR FUNÇÃO
                                isAValidDate = validateFutureDate(creationPossibleDateConverted);

                                if(!isAValidDate)
                                    throw new RuntimeException("Impossível marcar evento para datas já passadas. Tente novamente...");
                            } catch(Exception error) {
                                System.out.println(error.getMessage());
                            }
                        } while(!isAValidDate);
                        
                        ArrayList<EventTimetable> creationTimetables = new ArrayList();
                    
                        if(confirm("Deseja adicionar um horário a essa data?")) {
                            do {
                                System.out.printf("Horário %d\n", creationGuestsUsernames.size() + 1);
                                
                                System.out.printf("De (hh:mm): ");
                                String creationFrom = scanner.nextLine();
                                
                                LocalTime cFConverted = LocalTime.parse(creationFrom, timeFormatter);
                                
                                System.out.printf("Até (hh:mm): ");
                                String creationTo = scanner.nextLine();
                                
                                LocalTime cTConverted = LocalTime.parse(creationTo, timeFormatter);
                                
                                //Verificar se os horários são válidos (não há caracteres inválidos ou valores absurdos)
                                
                                creationTimetables.add(new EventTimetable(creationFrom, creationTo));
                            } while(creationPossibleDatesCreator.size() > 0 && confirm("Deseja adicionar outra data?"));
                        }
                        
                        if(creationTimetables.size() == 0)
                            creationPossibleDatesCreator.add(new EventDate(creationPossibleDate, creationTimetables));
                        else
                            creationPossibleDatesCreator.add(new EventDate(creationPossibleDate));
                        
                        creationPossibleDatesGuest.add(new EventDate(creationPossibleDate));
                    } while(creationPossibleDatesCreator.size() > 0 && confirm("Deseja adicionar outra data?"));
                    
                    loggedAccount.getSchedule().createEvent(new UnscheduledEvent(creationEventName, creationEventDescription, loggedAccount.getUsername(), creationPossibleDatesCreator));
                    
                    Iterator accountsIterator = accounts.iterator();
                    while(accountsIterator.hasNext()) {
                        Account tempAccount = (Account) accountsIterator.next();
                        
                        // This is done so that each person receives a unique object and not a reference copy.
                        ArrayList<EventDate> newCreationPossibleDatesGuest = new ArrayList();
                        newCreationPossibleDatesGuest.addAll(creationPossibleDatesGuest);

                        if(creationGuestsUsernames.contains(tempAccount.getUsername()))
                            tempAccount.getSchedule().createEvent(new UnscheduledEvent(creationEventName, creationEventDescription, loggedAccount.getUsername(), newCreationPossibleDatesGuest));
                    }
                    */
                    break;
                case 4:
                    
                    break;
                case 5:
                    if(confirm("Deseja mesmo sair?"))
                        loggedAccount = null;
                    
                    break;
            }
        } while(option != 6); 
    }
    
    public static void printMenuTitle(String title) {
        System.out.printf("\n\n---+ %s +---\n\n", title);
    }
    
    public static void printSubtitle(String title) {
        System.out.printf("\n\n> %s <\n\n", title);
    }
    
    public static boolean confirm (String message) {
        System.out.print(message + " [y/N] ");
        String confirm = scanner.nextLine();

        return (confirm.equalsIgnoreCase("y") || confirm.equalsIgnoreCase("yes"));
    }
    
    public static String mandatoryStringInput(String label, String errorMessage, boolean canContainSpaces) {
        String input = "";
        
        do {
            try {
                System.out.print(label);
                input = scanner.nextLine();

                if(input.isBlank()) 
                    throw new RuntimeException(errorMessage);
                
                if(!canContainSpaces && input.contains("\\s"))
                    throw new RuntimeException("Input não pode conter espaços em branco, tente novamente...");
            } catch(Exception error) {
                System.out.println(error.getMessage());
            }
        } while(input.isBlank() || input.contains("\\s"));
        
        return input;
    }
    
    public static boolean validateStrDate(String dateStr) {
        return dateStr.matches("\\d{1,2}/\\d{1,2}/\\d{2,4}");
    }
    
    public static boolean validateFutureDate(LocalDate date) {
        
        return false;
    }
}
