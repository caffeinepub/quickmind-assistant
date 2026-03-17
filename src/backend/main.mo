import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";

actor {
  type Message = {
    role : Text; // "user" or "assistant"
    content : Text;
  };

  let chatHistories = Map.empty<Text, List.List<Message>>();

  public shared ({ caller }) func addMessage(sessionId : Text, role : Text, content : Text) : async () {
    let message : Message = {
      role;
      content;
    };

    let history = switch (chatHistories.get(sessionId)) {
      case (null) {
        let newHistory = List.empty<Message>();
        chatHistories.add(sessionId, newHistory);
        newHistory;
      };
      case (?existing) { existing };
    };

    history.add(message);
  };

  public query ({ caller }) func getHistory(sessionId : Text) : async [Message] {
    switch (chatHistories.get(sessionId)) {
      case (null) { [] };
      case (?history) { history.toArray() };
    };
  };

  public shared ({ caller }) func clearHistory(sessionId : Text) : async () {
    chatHistories.remove(sessionId);
  };
};
