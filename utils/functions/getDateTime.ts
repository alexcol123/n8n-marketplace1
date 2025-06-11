

export function getDateTime(): string {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const yearShort = String(now.getFullYear()).slice(2);
	const minutes = String(now.getMinutes()).padStart(2, '0');

	let hour = now.getHours();
	const ampm = hour >= 12 ? 'PM' : 'AM';
	hour = hour % 12;
	hour = hour === 0 ? 12 : hour;

	return `${month}${day}${yearShort}-${hour}${minutes}${ampm}`;
}