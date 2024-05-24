export interface IPanelMsgObj {
  title: string;
  date?: string;
  subTitle: string;
  extra?: string;
  listTitle?: string;
  listTitleExtra?: string;
  messages?: string[];
  releases?: {
    date: string;
    status: string;
    messages: string[];
  }[];
  messagesExtra?: string[];
  buttons?: { txt: string; link: string }[];
}
