/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.co.ct.ctPhoneBook.accessories;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author goran
 */
public class DBConnection {
    
    public DBConnection() {
        //
    }
    
    //Change if needed. Assumed that database server is on the same server as web application server,
    //and tht database server runs on default postgres port (5432)
    private final String computerName = "localhost";
    private final String dbUserName = "postgres";
    private final String dbPassword = "kvaka22";
    
    public Connection getConnection() {
        Connection conn;        
        String url = "jdbc:postgresql://" + this.computerName + "/phonebook?" + 
                     "user=" + this.dbUserName + 
                     "&password=" + this.dbPassword;
        try {
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(url);
        } catch (SQLException | ClassNotFoundException ex) {
            return null;
        }
        
        return conn;
    }
    
}
