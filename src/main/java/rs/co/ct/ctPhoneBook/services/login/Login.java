/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.co.ct.ctPhoneBook.services.login;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.POST;
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
public class Login {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of Login
     */
    public Login() {
    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkAccountCredentials(String jsonEntryStr) {
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
                query += " AND ";
                query += "user_password = ?";

                PreparedStatement stmt = conn.prepareStatement(query);
                stmt.setString(1, username.toLowerCase()); 
                stmt.setString(2, password); 
                ResultSet rs = stmt.executeQuery(); 
                rs.next();
                
                boolean couldEnterAccountIntoDB = false;
                int numberOfExistingAccounts = rs.getInt("numberOfExistingAccounts");
                if (numberOfExistingAccounts > 0) {
                    resultJSON.put("status", "Success");
                } else { 
                    resultJSON.put("status", "AccountDoesNotExist"); 
                    resultJSON.put("problemMessage", "Username or password, or both, are not valid.");
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
