
var ConversationList = React.createClass({
  // Make sure this.props.data is an array
   propTypes: {
     data: React.PropTypes.array.isRequired
   },
   render: function() {

     window.foo            = this.props.data;
     var conversationNodes = this.props.data.map(function(conversation, index) {

       return (
         <Conversation id={conversation.id} key={index}>
           last_message_snippet={conversation.last_message_snippet}
           other_user_id={conversation.other_user_id}
         </Conversation>
       );
     });

     return (
       <div className="conversationList">
         {conversationNodes}
       </div>
     );
   }
 });

 export declare interface AppProps {
  children?: React.ReactNode; // best, accepts everything React can render
  childrenElement: JSX.Element; // A single React element
  style?: React.CSSProperties; // to pass through style props
  onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
  //  more info: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring
  props: Props & React.ComponentPropsWithoutRef<"button">; // to impersonate all the props of a button element and explicitly not forwarding its ref
  props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref
}

type AppProps = {
  message: string;
  count: number;
  disabled: boolean;
  /** array of a type! */
  names: string[];
  /** string literals to specify exact string values, with a union type to join them together */
  status: "waiting" | "success";
  /** any object as long as you dont use its properties (NOT COMMON but useful as placeholder) */
  obj: object;
  obj2: {}; // almost the same as `object`, exactly the same as `Object`
  /** an object with any number of properties (PREFERRED) */
  obj3: {
    id: string;
    title: string;
  };
