/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.co.ct.ctPhoneBook.services.phones;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.commons.dbutils.DbUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import rs.co.ct.ctPhoneBook.accessories.DBAccessories;

/**
 * REST Web Service
 *
 * @author goran
 */
@Path("services")
public class Phones {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of Phones
     */
    public Phones() {
    }

    @POST
    @Path("phones/read")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response readContact(String jsonEntryStr) {
        JSONObject resultJSON = new JSONObject();  
        
        DBAccessories dBAccessories = new DBAccessories();
        Connection conn = dBAccessories.getConnection();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        JSONArray jwtContacts = new JSONArray();
        if (conn != null) {
            try {
                JSONObject jsonEntry = new JSONObject(jsonEntryStr);
                int idAccount = (Integer)jsonEntry.get("idAccountObj");
                
                String query = "SELECT ";
                query += "A.id_contacts,";
                query += "B.id_phones,";
                query += "A.name,";
                query += "CASE WHEN A.nickname IS NOT NULL THEN A.nickname ELSE '' END AS nickname,";
                query += "CASE WHEN A.surname IS NOT NULL THEN A.surname ELSE '' END AS surname,";
                query += "B.phone_number";
                query += " FROM ";
                query += "contacts A ";
                query += "LEFT JOIN phones B ON B.id_contacts = A.id_contacts ";
                query += " WHERE ";
                query += "A.id_accounts = ?";

                stmt = conn.prepareStatement(query);
                stmt.setInt(1, idAccount); 
                rs = stmt.executeQuery(); 
                
                while (rs.next()) {
                    int idContact = rs.getInt("id_contacts");
                    int idPhone = rs.getInt("id_phones");
                    String name = rs.getString("name");
                    String nickname = rs.getString("nickname");
                    String surname = rs.getString("surname");
                    String phone = rs.getString("phone_number");
                    
                    JSONObject tableRow = new JSONObject();
                    tableRow.put("id", idContact);
                    tableRow.put("id_phones", idPhone);
                    tableRow.put("name", name);
                    tableRow.put("nickname", nickname);
                    tableRow.put("surname", surname);
                    tableRow.put("phone_number", phone);
                    
                    jwtContacts.put(tableRow);
                }                    
                  
                resultJSON.put("status", "Success");    
                resultJSON.put("contacts", jwtContacts);            
            } catch (SQLException ex) {
                resultJSON.put("status", "CannotReadFromDatabase"); 
                resultJSON.put("problemMessage", "Fatal error. Problem with reading data from database");
            }
        } else {
            resultJSON.put("status", "CannotConnectToDatabase"); 
            resultJSON.put("problemMessage", "Fatal error. Problem with connecting to database");
        }
        
        if (conn != null) {
            DbUtils.closeQuietly(conn);
        }
        if (stmt != null) {
            DbUtils.closeQuietly(stmt);
        }
        if (rs != null) {
            DbUtils.closeQuietly(rs);
        }
        
        String returnJSONStr = resultJSON.toString(); 
        return Response.status(200).entity(returnJSONStr).build();
    }

    @POST
    @Path("phones/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addContact(String jsonEntryStr) {
        JSONObject resultJSON = new JSONObject();  
        
        DBAccessories dBAccessories = new DBAccessories();
        Connection conn = dBAccessories.getConnection();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        if (conn != null) {
            try {
                conn.setAutoCommit(false);
                
                JSONObject jsonEntry = new JSONObject(jsonEntryStr);
                
                int idAccount = (Integer)jsonEntry.get("idAccountObj");
                String name = (String)jsonEntry.get("nameObj");
                String nickname = (String)jsonEntry.get("nicknameObj");
                String surname = (String)jsonEntry.get("surnameObj");
                String phone = (String)jsonEntry.get("phoneObj");
                
                String query = "INSERT INTO contacts (";
                query += "id_accounts, name, nickname, surname";
                query += ") VALUES (";
                query += "?, ?, ?, ?)";
                
                stmt = conn.prepareStatement(query);
                stmt.setInt(1, idAccount);
                stmt.setString(2, name);
                if (nickname.length() > 0) {
                    stmt.setString(3, nickname);
                } else {
                    stmt.setNull(3, Types.VARCHAR);
                }
                if (surname.length() > 0) {
                    stmt.setString(4, surname);
                } else {
                    stmt.setNull(4, Types.VARCHAR);
                }
                int numberOfAddedContacts = stmt.executeUpdate();
                
                if (numberOfAddedContacts == 1) {
                    query = "SELECT ";
                    query += "MAX(id_contacts) AS id_contacts";
                    query += " FROM ";
                    query += "contacts ";
                    query += " WHERE ";
                    query += "id_accounts = ?";
                    query += " AND ";
                    query += "name = ?";
                    query += " AND ";
                    if (nickname.length() > 0) {
                        query += "nickname = ?";                        
                    } else {
                        query += "nickname IS NULL";
                    }
                    query += " AND ";
                    if (surname.length() > 0) {
                        query += "surname = ?";                        
                    } else {
                        query += "surname IS NULL";
                    }
                    
                    stmt = conn.prepareStatement(query);
                    int paramIndex = 1;
                    stmt.setInt(paramIndex, idAccount);
                    paramIndex++;
                    stmt.setString(paramIndex, name);
                    paramIndex++;
                    if (nickname.length() > 0) {
                        stmt.setString(paramIndex, nickname);
                        paramIndex++;
                    }
                    if (surname.length() > 0) {
                        stmt.setString(paramIndex, surname);
                    }
                    rs = stmt.executeQuery(); 
                    
                    int idContact = 0;
                    if (rs.next()) {
                        idContact = rs.getInt("id_contacts");
                    } else {
                        //That is, someting is very wrong.
                        resultJSON.put("status", "CannotAddIntoDatabase");
                        resultJSON.put("problemMessage", "Fatal error. Cannot add this contact into database (1)");
                    }
                    
                    if (idContact > 0) {
                        query = "INSERT INTO phones (";
                        query += "id_contacts, phone_number";
                        query += ") VALUES (";
                        query += "?, ?)";
                        
                        stmt = conn.prepareStatement(query);
                        stmt.setInt(1, idContact);
                        stmt.setString(2, phone);
                        int numberOfAddedAcounts = stmt.executeUpdate();

                        if (numberOfAddedAcounts == 1) {
                            resultJSON.put("status", "Success"); 
                        } else {
                            resultJSON.put("status", "CannotAddIntoToDatabase"); 
                            resultJSON.put("problemMessage", "Fatal error. Cannot add this contact into database (2)");
                        }
                    }
                } else {
                    resultJSON.put("status", "CannotAddIntoDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot add this contact into database (3)");
                }
            } catch (SQLException ex) {
                resultJSON.put("status", "CannotAddIntoDatabase");
                resultJSON.put("problemMessage", "Fatal error. Cannot add this contact into database (4)");
            } 
            
            String status = resultJSON.getString("status");
            if (status.compareTo("Success") == 0) {
                try {
                    conn.commit();
                } catch (SQLException ex) {
                    resultJSON.remove("status");
                    resultJSON.put("status", "CannotAddIntoDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot add this contact into database (5)");
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } else {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } 
        } else {
            resultJSON.put("status", "CannotConnectToDatabase"); 
            resultJSON.put("problemMessage", "Fatal error. Problem with connecting to database");
        }
        
        if (conn != null) {
            DbUtils.closeQuietly(conn);
        }
        if (stmt != null) {
            DbUtils.closeQuietly(stmt);
        }
        if (rs != null) {
            DbUtils.closeQuietly(rs);
        }
        
        String returnJSONStr = resultJSON.toString();        
        return Response.status(200).entity(returnJSONStr).build();
    }

    @POST
    @Path("phones/modify")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response modifyContact(String jsonEntryStr) {
        JSONObject resultJSON = new JSONObject();  
        
        DBAccessories dBAccessories = new DBAccessories();
        Connection conn = dBAccessories.getConnection();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        if (conn != null) {
            try {
                conn.setAutoCommit(false);
                
                JSONObject jsonEntry = new JSONObject(jsonEntryStr);
                
                int idContact = (Integer)jsonEntry.get("idContactObj");
                int idPhone = (Integer)jsonEntry.get("idPhoneObj");
                String name = (String)jsonEntry.get("nameObj");
                String nickname = (String)jsonEntry.get("nicknameObj");
                String surname = (String)jsonEntry.get("surnameObj");
                String phone = (String)jsonEntry.get("phoneObj");
                
                String query = "UPDATE contacts SET ";
                query += "name = ?,";
                query += "nickname = ?,";
                query += "surname = ?";
                query += " WHERE ";
                query += "id_contacts = ?";
                
                stmt = conn.prepareStatement(query);
                stmt.setString(1, name);
                if (nickname.length() > 0) {
                    stmt.setString(2, nickname);
                } else {
                    stmt.setNull(2, Types.VARCHAR);
                }
                if (surname.length() > 0) {
                    stmt.setString(3, surname);
                } else {
                    stmt.setNull(3, Types.VARCHAR);
                }
                stmt.setInt(4, idContact);
                int numberOfUpdatedContacts = stmt.executeUpdate();
                
                if (numberOfUpdatedContacts == 1) {                    
                    query = "UPDATE phones SET ";
                    query += "phone_number = ?";
                    query += " WHERE ";                   
                    query += "id_phones = ?";                   
                    query += " AND ";                   
                    query += "id_contacts = ?";

                    stmt = conn.prepareStatement(query);
                    stmt.setString(1, phone);
                    stmt.setInt(2, idPhone);
                    stmt.setInt(3, idContact);
                    int numberOfUpdatedPhones = stmt.executeUpdate();

                    if (numberOfUpdatedPhones == 1) {
                        resultJSON.put("status", "Success"); 
                    } else {
                        resultJSON.put("status", "CannotUpdateDatabase"); 
                        resultJSON.put("problemMessage", "Fatal error. Cannot update this contact (1)");
                    }
                } else {
                    resultJSON.put("status", "CannotUpdateDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot update this contact (2)");
                }
            } catch (SQLException ex) {
                resultJSON.put("status", "CannotUpdateDatabase");
                resultJSON.put("problemMessage", "Fatal error. Cannot update this contact (3)");
            } 
            
            String status = resultJSON.getString("status");
            if (status.compareTo("Success") == 0) {
                try {
                    conn.commit();
                } catch (SQLException ex) {
                    resultJSON.remove("status");
                    resultJSON.put("status", "CannotUpdateDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot update this contact (4)");
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } else {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } 
        } else {
            resultJSON.put("status", "CannotConnectToDatabase"); 
            resultJSON.put("problemMessage", "Fatal error. Problem with connecting to database");
        }
        
        if (conn != null) {
            DbUtils.closeQuietly(conn);
        }
        if (stmt != null) {
            DbUtils.closeQuietly(stmt);
        }
        if (rs != null) {
            DbUtils.closeQuietly(rs);
        }
        
        String returnJSONStr = resultJSON.toString();        
        return Response.status(200).entity(returnJSONStr).build();
    }

    @POST
    @Path("phones/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteContact(String jsonEntryStr) {
        JSONObject resultJSON = new JSONObject();  
        
        DBAccessories dBAccessories = new DBAccessories();
        Connection conn = dBAccessories.getConnection();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        if (conn != null) {
            try {
                conn.setAutoCommit(false);
                
                JSONObject jsonEntry = new JSONObject(jsonEntryStr);
                
                int idContact = (Integer)jsonEntry.get("idContactObj");
                int idPhone = (Integer)jsonEntry.get("idPhoneObj");
                
                String query = "DELETE FROM phones";
                query += " WHERE ";
                query += "id_phones = ?";
                
                stmt = conn.prepareStatement(query);
                stmt.setInt(1, idPhone);
                int numberOfDeletedContacts = stmt.executeUpdate();
                
                if (numberOfDeletedContacts == 1) {
                    query = "DELETE FROM contacts";
                    query += " WHERE ";
                    query += "id_contacts = ?"; 

                    stmt = conn.prepareStatement(query);
                    stmt.setInt(1, idContact);
                    int numberOfDeletedPhones = stmt.executeUpdate();

                    if (numberOfDeletedPhones == 1) {
                        resultJSON.put("status", "Success"); 
                    } else {
                        resultJSON.put("status", "CannotDeleteInDatabase"); 
                        resultJSON.put("problemMessage", "Fatal error. Cannot delete this contact (1)");
                    }
                } else {
                    resultJSON.put("status", "CannotDeleteInDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot delete this contact (2)");
                }
            } catch (SQLException ex) {
                resultJSON.put("status", "CannotDeleteInDatabase");
                resultJSON.put("problemMessage", "Fatal error. Cannot delete this contact (3)");
            } 
            
            String status = resultJSON.getString("status");
            if (status.compareTo("Success") == 0) {
                try {
                    conn.commit();
                } catch (SQLException ex) {
                    resultJSON.remove("status");
                    resultJSON.put("status", "CannotDeleteInDatabase");
                    resultJSON.put("problemMessage", "Fatal error. Cannot delete this contact (4)");
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } else {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    resultJSON.put("problemMessageAdditional", "Fatal error. Cannot rollback data.");
                }
            } 
        } else {
            resultJSON.put("status", "CannotConnectToDatabase"); 
            resultJSON.put("problemMessage", "Fatal error. Problem with connecting to database");
        }
        
        if (conn != null) {
            DbUtils.closeQuietly(conn);
        }
        if (stmt != null) {
            DbUtils.closeQuietly(stmt);
        }
        if (rs != null) {
            DbUtils.closeQuietly(rs);
        }
        
        String returnJSONStr = resultJSON.toString();        
        return Response.status(200).entity(returnJSONStr).build();
    }
}
