import { Button } from "./../Utils";

const menu_items = [
	{
		title: "Explore Data",
	},
	{
		title: "Blog",
		url: "blog"
	},
	{
		title: "About",
		url: "about"
	},
	{
		title: "FAQ",
		url: "faq"
	},
	{
		title: "Methodology",
		url: "methodology"
	},
	{
		title: "Resources",
		url: "resources"
	}
]

export default function Header({ showMenu }) {
	return (
		<nav id="main-menu"
			className="w-80 absolute right-0 top-40 z-40 translate-x-full opacity-0 bg-white shadow overflow-y-scroll"
			style={showMenu ? {
					height: "calc(100% - 5rem)",
					transform: "none",
					opacity: 1
			} : {}}>
			<ul role="menubar"
				aria-label="Main menu"
				className="py-4">
				{menu_items.map((menu_item, index) => (
					<li key={index}
						className="px-4 py-2 text-xxl">
						<a role="menuitem"
							 href={menu_item.url ? `${process.env.WP_URL}${menu_item.url}` : "/"}>
							{menu_item.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}