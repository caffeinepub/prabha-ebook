import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";

actor {
  type PurchaseInquiry = {
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Time.Time;
  };

  module PurchaseInquiry {
    public func compareByTimestamp(a : PurchaseInquiry, b : PurchaseInquiry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let inquiries = Map.empty<Text, PurchaseInquiry>();

  public shared ({ caller }) func submitInquiry(name : Text, email : Text, phone : Text) : async () {
    if (inquiries.containsKey(email)) { Runtime.trap("To prevent double book keeping, this email address has already been used for an inquiry.") };
    let entry = {
      name;
      email;
      phone;
      timestamp = Time.now();
    };
    inquiries.add(email, entry);
  };

  func getAllInquiriesSorted() : [PurchaseInquiry] {
    inquiries.values().toArray().sort(PurchaseInquiry.compareByTimestamp);
  };

  public query ({ caller }) func getAllInquiries() : async [PurchaseInquiry] {
    getAllInquiriesSorted();
  };

  public query ({ caller }) func checkSubmitted(email : Text) : async Bool {
    inquiries.containsKey(email);
  };
};
