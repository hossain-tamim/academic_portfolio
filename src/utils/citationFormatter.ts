interface Publication {
  authors: string;
  year: number;
  title: string;
  venue: string;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  publisher?: string | null;
  doi?: string | null;
}

export function formatAPACitation(pub: Publication): string {
  let citation = `${pub.authors} (${pub.year}). ${pub.title}. `;
  
  // Add venue (italicized in display)
  citation += `*${pub.venue}*`;
  
  // Add volume and issue if available
  if (pub.volume) {
    citation += `, *${pub.volume}*`;
    if (pub.issue) {
      citation += `(${pub.issue})`;
    }
  }
  
  // Add pages if available
  if (pub.pages) {
    citation += `, ${pub.pages}`;
  }
  
  citation += '.';
  
  // Add publisher if available
  if (pub.publisher) {
    citation += ` ${pub.publisher}.`;
  }
  
  // Add DOI if available
  if (pub.doi) {
    citation += ` https://doi.org/${pub.doi}`;
  }
  
  return citation;
}

export function getPublicationBadgeColor(type: string, badge?: string | null): string {
  if (type === 'JOURNAL' && badge) {
    const colors: { [key: string]: string } = {
      'Q1': 'bg-green-100 text-green-800',
      'Q2': 'bg-blue-100 text-blue-800',
      'Q3': 'bg-yellow-100 text-yellow-800',
      'Q4': 'bg-orange-100 text-orange-800',
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  }
  
  const typeColors: { [key: string]: string } = {
    'PREPRINT': 'bg-purple-100 text-purple-800',
    'JOURNAL': 'bg-blue-100 text-blue-800',
    'CONFERENCE': 'bg-indigo-100 text-indigo-800',
    'REVIEW': 'bg-pink-100 text-pink-800',
  };
  
  return typeColors[type] || 'bg-gray-100 text-gray-800';
}

export function getPublicationBadgeText(type: string, badge?: string | null): string {
  if (type === 'JOURNAL' && badge) {
    return badge;
  }
  
  const typeLabels: { [key: string]: string } = {
    'PREPRINT': 'Preprint',
    'JOURNAL': 'Journal',
    'CONFERENCE': 'Conference',
    'REVIEW': 'Review Paper',
  };
  
  return typeLabels[type] || type;
}