import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import RBTree "mo:base/RBTree";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";

actor {

  type Gender = {
    #Male;
    #Female;
  };

  type Record = {
    recordId : Text;
    adminName : Text;
    crimeType : Text;
    crimeDescription: Text;
    date : Text;
    time : Text;
    evidenceDetails : Text;
    crimeArea : Text;
    eyeWitness : Text;
  };

  type Admin = {
    name : Text;
    dob : Text;
    gender : Gender;
    mobile : Text;
    requests : [Text];
  };

  type User = {
    name : Text;
    dob : Text;
    gender : Gender;
    admins : [Principal];
    noofrecords : Nat;
    requests : [Text];
  };

  type RequestStatus = {
    #Complete;
    #Reject;
    #Accept;
    #Nota;
  };

  type Request = {
    userPrincipal : Principal;
    adminPrincipal : Principal;
    expries : Time.Time;
    note : Text;
    status : RequestStatus;
    isEmergency : Bool;
    requestedOn : Time.Time;
  };

  var users = RBTree.RBTree<Principal, User>(Principal.compare);
  var admins = RBTree.RBTree<Principal, Admin>(Principal.compare);
  var requests = RBTree.RBTree<Text, Request>(Text.compare);

  // function to create a Admin account
  public shared (msg) func createAdmin(name : Text, dob : Text, gender : Gender, mobile : Text) : async {
    statusCode : Nat;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var admin = admins.get(msg.caller);
      switch (admin) {
        case (null) {
          var user = users.get(msg.caller);
          switch (user) {
            case (null) {
              var admin : Admin = {
                name = name;
                dob = dob;
                gender = gender;
                mobile = mobile;
                requests = [];
              };
              admins.put(msg.caller, admin);
              return {
                statusCode = 200;
                msg = "Registered as Admin Successfully.";
              };
            };
            case (?user) {
              return {
                statusCode = 403;
                msg = "A User Account Exists with this Identity";
              };
            };
          };
        };
        case (?user) {
          return {
            statusCode = 403;
            msg = "Admin Already Exists with this Identity";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  // function to create a User account
  public shared (msg) func createUser(name : Text, dob : Text, gender : Gender) : async {
    statusCode : Nat;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          var admin = admins.get(msg.caller);
          switch (admin) {
            case (null) {
              var user : User = {
                name = name;
                dob = dob;
                gender = gender;
                admins = [];
                noofrecords = 0;
                requests = [];
              };
              users.put(msg.caller, user);
              return {
                statusCode = 200;
                msg = "Registered as User Successfully.";
              };
            };
            case (?admin) {
              return {
                statusCode = 403;
                msg = "A Admin Account Exists with this Identity";
              };
            };
          };
        };
        case (?user) {
          return {
            statusCode = 403;
            msg = "User account Already Exists with this Identity";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  // function to check whether caller has a account or not
  public shared query (msg) func isAccountExists() : async {
    statusCode : Nat;
    msg : Text;
    principal : Principal;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          var admin = admins.get(msg.caller);
          switch (admin) {
            case (null) {
              return { statusCode = 200; msg = "null"; principal = msg.caller };
            };
            case (?admin) {
              return {
                statusCode = 200;
                msg = "admin";
                principal = msg.caller;
              };
            };
          };
        };
        case (?user) {
          return { statusCode = 200; msg = "user"; principal = msg.caller };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
        principal = msg.caller;
      };
    };
  };

  public shared query (msg) func getAdminDetails() : async {
    statusCode : Nat;
    doc : ?Admin;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var admin = admins.get(msg.caller);
      switch (admin) {
        case (null) {
          return {
            statusCode = 403;
            doc = null;
            msg = "This identity doesn't have any Admin Account";
          };
        };
        case (?admin) {
          return {
            statusCode = 200;
            doc = ?admin;
            msg = "Retrived Admin Details Successsfully.";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        doc = null;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  public shared query (msg) func getUserDetails() : async {
    statusCode : Nat;
    user : ?User;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          return {
            statusCode = 403;
            user = null;
            msg = "This identity doesn't have any User Account";
          };
        };
        case (?user) {
          return {
            statusCode = 200;
            user = ?user;
            msg = "Retrived User Details Successsfully.";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        user = null;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };


//get Record details
var records : [Record] = [];

  public shared func submitRecord(record : Record) : async () {
    records := Array.append<Record>(records, [record]);
  };

  public shared query func getRecordDetails() : async [Record] {
    return records;
  };

};

