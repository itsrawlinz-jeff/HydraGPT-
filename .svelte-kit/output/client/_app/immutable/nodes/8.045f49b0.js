import{s as d,e as c,H as m,c as h,b as l,u as f,f as o,h as g,i as v,j as y,n as i}from"../chunks/scheduler.953cfe2b.js";import{S as b,i as w}from"../chunks/index.1fa04a18.js";import{m as _}from"../chunks/marked.esm.76161808.js";const k=`## Privacy\r
\r
> Last updated: October 4, 2023\r
\r
Users of HuggingChat are authenticated through their HF user account.\r
\r
By default, your conversations may be shared with the respective models' authors to improve their training data and model over time. Model authors are the custodians of the data collected by their model, even if it's hosted on our platform.\r
\r
If you disable data sharing in your settings, your conversations will not be used for any downstream usage (including for research or model training purposes), and they will only be stored to let you access past conversations. You can click on the Delete icon to delete any past conversation at any moment.\r
\r
🗓 Please also consult huggingface.co's main privacy policy at <https://huggingface.co/privacy>. To exercise any of your legal privacy rights, please send an email to <privacy@huggingface.co>.\r
\r
## About available LLMs\r
\r
The goal of this app is to showcase that it is now possible to build an open source alternative to ChatGPT. 💪\r
\r
For now (October 2023), it's running:\r
\r
- [Llama 2 70B](https://huggingface.co/meta-llama/Llama-2-70b-chat-hf)\r
- [CodeLlama 35B](https://about.fb.com/news/2023/08/code-llama-ai-for-coding/)\r
- [Falcon 180B](https://www.tii.ae/news/technology-innovation-institute-introduces-worlds-most-powerful-open-llm-falcon-180b)\r
- [Mistral 7B](https://mistral.ai/news/announcing-mistral-7b/)\r
\r
## Technical details\r
\r
This app is running in a [Space](https://huggingface.co/docs/hub/spaces-overview), which entails that the code for this UI is publicly visible [inside the Space repo](https://huggingface.co/spaces/huggingchat/chat-ui/tree/main).\r
\r
**Further development takes place on the [huggingface/chat-ui GitHub repo](https://github.com/huggingface/chat-ui).**\r
\r
The inference backend is running the optimized [text-generation-inference](https://github.com/huggingface/text-generation-inference) on HuggingFace's Inference API infrastructure.\r
\r
It is therefore possible to deploy a copy of this app to a Space and customize it (swap model, add some UI elements, or store user messages according to your own Terms and conditions). You can also 1-click deploy your own instance using the [Chat UI Spaces Docker template](https://huggingface.co/new-space?template=huggingchat/chat-ui-template).\r
\r
We welcome any feedback on this app: please participate to the public discussion at <https://huggingface.co/spaces/huggingchat/chat-ui/discussions>\r
\r
<a target="_blank" href="https://huggingface.co/spaces/huggingchat/chat-ui/discussions"><img src="https://huggingface.co/datasets/huggingface/badges/raw/main/open-a-discussion-xl.svg" title="open a discussion"></a>\r
`;function x(u){let e,t,n,p=_(k,{gfm:!0})+"";return{c(){e=c("div"),t=c("div"),n=new m(!1),this.h()},l(a){e=h(a,"DIV",{class:!0});var s=l(e);t=h(s,"DIV",{class:!0});var r=l(t);n=f(r,!1),r.forEach(o),s.forEach(o),this.h()},h(){n.a=null,g(t,"class","prose mx-auto px-4 pb-24 pt-6 dark:prose-invert md:pt-12"),g(e,"class","overflow-auto p-6")},m(a,s){v(a,e,s),y(e,t),n.m(p,t)},p:i,i,o:i,d(a){a&&o(e)}}}class L extends b{constructor(e){super(),w(this,e,null,x,d,{})}}export{L as component};
