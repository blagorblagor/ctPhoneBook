/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.co.ct.ctPhoneBook.services.newAccount;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONObject;
import rs.co.ct.ctPhoneBook.accessories.DBConnection;

/**
 * REST Web Service
 *
 * @author goran
 */

@Path("services")
public class NewAccount {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of NewAccount
     */
    public NewAccount() {
    }

    @POST
    @Path("newAccount")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addNewAccountIntoDB(String jsonEntryStr) {
        JSONObject resultJSON = new JSONObject();  
        
        DBConnection dBConnection = new DBConnection();
        Connection conn = dBConnection.getConnection();
        if (conn != null) {
            try {
                JSONObject jsonEntry = new JSONObject(jsonEntryStr);
                String username = (String)jsonEntry.get("usernameObj");
                String password = (String)jsonEntry.get("passwordObj");
                
                String query = "SELECT ";
                query += "COUNT(*) AS numberOfExistingAccounts";
                query += " FROM ";
                query += "accounts ";
                query += " WHERE ";
                query += "lower(user_name) = ?";

                PreparedStatement stmt = conn.prepareStatement(query);
                stmt.setString(1, username.toLowerCase()); 
                ResultSet rs = stmt.executeQuery(); 
                rs.next();
                
                boolean couldEnterAccountIntoDB = false;
                int numberOfExistingAccounts = rs.getInt("numberOfExistingAccounts");
                if (numberOfExistingAccounts > 0) {
                    resultJSON.put("status", "AlreadyExistingAccount"); 
                    resultJSON.put("problemMessage", "Username already exists. Please, choose another one.");
                } else {
                    couldEnterAccountIntoDB = true;
                }
                
                if (couldEnterAccountIntoDB) {
                    query = "INSERT INTO accounts (";
                    query += "user_name, user_password";
                    query += ") VALUES (";
                    query += "?, ?";
                    query += ")";
                    
                    stmt = conn.prepareStatement(query);
                    stmt.setString(1, username);
                    stmt.setString(2, password);
                    int numberOfAddedAcounts = stmt.executeUpdate(); 
                    
                    if (numberOfAddedAcounts == 1) {
                        resultJSON.put("status", "Success"); 
                    } else {
                        resultJSON.put("status", "CannotConnectToDatabase"); 
                        resultJSON.put("problemMessage", "Fatal error. Cannot add this account onto database");
                    }
                }
                
            } catch (SQLException ex) {
                resultJSON.put("status", "CannotReadFromDatabase"); 
                resultJSON.put("problemMessage", "Fatal error. Problem with reading data from database");
            }
        } else {
            resultJSON.put("status", "CannotConnectToDatabase"); 
            resultJSON.put("problemMessage", "Fatal error. Problem with connecting to database");
        }
        
        String returnJSONStr = resultJSON.toString();        
        return Response.status(200).entity(returnJSONStr).build();
    }
}
