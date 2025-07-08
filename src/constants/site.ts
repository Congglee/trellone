import { envConfig } from '~/constants/config'
import { SiteConfig } from '~/types/utils.type'

export const siteConfig: SiteConfig = {
  name: 'Trellone',
  author: 'Congglee',
  description:
    'Trellone is a modern, feature-rich Trello clone that provides project management and collaboration capabilities with real-time updates.',
  keywords: ['Trellone', 'Trello clone', 'Drag-and-Drop', 'Task Management', 'Project Management', 'Collaboration'],
  links: {
    github: 'https://github.com/Congglee/trellone'
  },
  url: {
    base: envConfig.baseUrl,
    author: 'https://github.com/Congglee'
  },
  ogImage: 'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAZWyfhSPRvP1kJeo5WtxDd6gsIVYzjwXHyfMK'
}
