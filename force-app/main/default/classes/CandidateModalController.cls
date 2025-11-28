public with sharing class CandidateModalController {
    
    @AuraEnabled(cacheable=true)
    public static User getUserInfo() {
        return [SELECT Id, LastName FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
    }
    //GIT

     //commit
    //Adrian waz hier
    @AuraEnabled(cacheable=true)
    public static List<Candidate__c> getCandidates() {
        return [
            SELECT Id, First_Name__c, Last_Name__c, Phone__c, Email__c 
            FROM Candidate__c 
            ORDER BY Last_Name__c 
            LIMIT 50
        ];
    }
}