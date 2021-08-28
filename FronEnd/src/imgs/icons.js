import React from "react";
import Icon from "@ant-design/icons";

const SqlSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" width="12" height="12"
         viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round"
         strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="7 8 3 12 7 16"/>
        <polyline points="17 8 21 12 17 16"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
    </svg>
);

const QuerySvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 13 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5357 0C12.2789 0 9.51786 0 9.51786 0H6.5H0.464286C0.207478 0 0 0.210795 0 0.47171V11.5283C0 11.7892 0.207478 12 0.464286 12H12.5357C12.7925 12 13 11.7892 13 11.5283V0.47171C13 0.210795 12.7925 0 12.5357 0ZM11.9167 4.69565H9.20833V2.6087H11.9167V4.69565ZM11.9167 7.82609H9.20833V5.73913H11.9167V7.82609ZM4.875 5.73913H8.125V7.82609H4.875V5.73913ZM8.125 4.69565H4.875V2.6087H8.125V4.69565ZM1.08333 5.73913H3.79167V7.82609H1.04464L1.08333 5.73913ZM1.08333 2.6087H3.79167V4.68851H1.04464L1.08333 2.6087ZM1.08333 8.86957H3.79167V10.9565H1.08333V8.86957ZM4.875 8.86957H8.125V10.9565H4.875V8.86957ZM11.9167 10.9565H9.20833V8.86957H11.9167V10.9565Z"/>
    </svg>
)

const ColumnSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 13 12" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5357 0C12.2789 0 9.51786 0 9.51786 0H6.5H0.464286C0.207478 0 0 0.210795 0 0.47171V11.5283C0 11.7892 0.207478 12 0.464286 12H12.5357C12.7925 12 13 11.7892 13 11.5283V0.47171C13 0.210795 12.7925 0 12.5357 0ZM11.9167 4.69565H9.20833V2.6087H11.9167V4.69565ZM11.9167 7.82609H9.20833V5.73913H11.9167V7.82609ZM4.875 5.73913H8.125V7.82609H4.875V5.73913ZM8.125 4.69565H4.875V2.6087H8.125V4.69565ZM1.08333 5.73913H3.79167V7.82609H1.04464L1.08333 5.73913ZM1.08333 2.6087H3.79167V4.68851H1.04464L1.08333 2.6087ZM1.08333 8.86957H3.79167V10.9565H1.08333V8.86957ZM4.875 8.86957H8.125V10.9565H4.875V8.86957ZM11.9167 10.9565H9.20833V8.86957H11.9167V10.9565Z"/>
        <path d="M3.875 1V11H1V1H3.875Z" strokeWidth="2"/>
        <path d="M5.14587 0V12" stroke="white"/>
    </svg>

)

const SaveSvg = () => (
    <svg width="1em" height="1em"  viewBox="0 0 28 28" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 1H2C1.44772 1 1 1.44772 1 2V26C1 26.5523 1.44772 27 2 27H7M8.5 1V6.5C8.5 7.05228 8.94772 7.5 9.5 7.5H18.5C19.0523 7.5 19.5 7.05228 19.5 6.5V1M8.5 1H19.5M19.5 1H20.5622C20.8413 1 21.1077 1.11664 21.297 1.32172L26.7348 7.2127C26.9053 7.39743 27 7.63959 27 7.89098V26C27 26.5523 26.5523 27 26 27H21M7 27V19C7 18.4477 7.44772 18 8 18H14H20C20.5523 18 21 18.4477 21 19V27M7 27H21" strokeWidth="3"/>
    </svg>
)

const FlowSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-route" width="1em" height="1em"
         viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round"
         strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="6" cy="19" r="2"/>
        <circle cx="18" cy="5" r="2"/>
        <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5"/>
    </svg>
)

const LogOutSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="16" height="16"
         viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
        <path d="M7 12h14l-3 -3m0 6l3 -3"/>
    </svg>
)

const UsersSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="1em" height="1em"
         viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
         strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>
    </svg>
)

const JiraSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.7287 11.337L12.47 0.99448L11.4835 0L3.78949 7.7569L0.271265 11.3039C-0.0904216 11.6685 -0.0904216 12.2652 0.271265 12.663L7.30772 19.7569L11.4835 24L19.1776 16.2431L19.3091 16.1105L22.7287 12.663C23.0904 12.2983 23.0904 11.7017 22.7287 11.337ZM11.4835 15.547L7.96535 12L11.4835 8.453L15.0018 12L11.4835 15.547Z" fill="#2684FF"/>
        <path d="M11.4837 8.4531C9.18206 6.1327 9.18206 2.35365 11.4508 0.0332031L3.75671 7.7901L7.93256 12.0001L11.4837 8.4531Z" fill="url(#paint0_linear)"/>
        <path d="M15.0019 12L11.4836 15.547C13.7852 17.8674 13.7852 21.6464 11.4836 24L19.2105 16.2099L15.0019 12Z" fill="url(#paint1_linear)"/>
        <defs>
            <linearGradient id="paint0_linear" x1="10.8561" y1="4.85952" x2="5.90266" y2="9.77282" gradientUnits="userSpaceOnUse">
                <stop offset="0.176" stopColor="#0052CC"/>
                <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="12.1565" y1="19.0892" x2="17.1001" y2="14.1858" gradientUnits="userSpaceOnUse">
                <stop offset="0.176" stopColor="#0052CC"/>
                <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
        </defs>
    </svg>
)

export const SqlIcon = (props) => <Icon component={SqlSvg} className={'anticon-sql'} {...props}/>
export const QueryIcon = (props) => <Icon component={QuerySvg} className={'anticon-table'} {...props}/>
export const ColumnIcon = (props) => <Icon component={ColumnSvg} className={'anticon-column'} {...props}/>
export const SaveIcon = (props) => <Icon component={SaveSvg} className={'anticon-save'} {...props}/>
export const FlowIcon = (props) => <Icon component={FlowSvg} className={'anticon-flow'} {...props}/>
export const LogOutIcon = (props) => <Icon component={LogOutSvg} className={'anticon-logout'} {...props}/>
export const UsersIcon = (props) => <Icon component={UsersSvg} className={'anticon-users'} {...props}/>
export const JiraIcon = (props) => <Icon component={JiraSvg} className={'anticon-jira'} {...props}/>