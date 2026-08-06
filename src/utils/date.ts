const months = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August", 
  "September", "October", "November", "December"
];

export function getJoinedDate(dateString:string) {
    const date = new Date(dateString)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
}
export function getPostCreatedDate(dateString: string) {
  const date = new Date(dateString)
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}