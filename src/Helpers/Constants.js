export const UserTypes = [
  {
    title: "Doctor",
    value: "doctor"
  },
  {
    title: "Nurse",
    value: "nurse"
  },
  {
    title: "Babysitter",
    value: "babysitter"
  },
  {
    title: "Nursing Assistant",
    value: "caregiver"
  },

  {
    title: "Physiotherapist",
    value: "physiotherapy"
  },
  {
    title: "Lab",
    value: "lab"
  }]

export const DocTypes = [{
  title: "ID",
  value: "ID"
},
{
  title: "Certificate",
  value: "Certificate"
},
{
  title: "Healthcare Professional License",
  value: "Healthcare Professional License"
},
{
  title: "Professional Photo",
  value: "Professional Photo"
}]

let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const countries = [
  {
    id: '1',
    icon: require('../Icons/saudia.png'),
    code: '966'
  },
  {
    id: '2',
    icon: require('../Icons/uae.png'),
    code: '971'
  }
]
export {
  regemail,
  countries
}

