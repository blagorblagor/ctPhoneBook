/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.co.ct.ctPhoneBook.accessories;

/**
 *
 * @author goran
 */
public class PseudoVersion {
    
    private static PseudoVersion pseudoVersion = null;
    
    private PseudoVersion() {
        this.pseudoVersionJsCss = "?version=2"; //Increment pseudoversion number when changes on GUI are done
    }
    
    private final String pseudoVersionJsCss;
    
    /**
     * Pseudoversion number is used in scriptlet
     * in order to prevent caching on GUI
     * @return pseudoversion number
     */
    public String getPseudoVersionJsCss() {
        return pseudoVersionJsCss;
    }
    
    /**
     * Create singleton object of this class
     * @return singleton object
     */
    public static PseudoVersion GetPseudoVersion() {
        if (PseudoVersion.pseudoVersion == null) {
            PseudoVersion.pseudoVersion = new PseudoVersion();
        }
        return PseudoVersion.pseudoVersion;
    }
}
