"use client";

import { IdCard } from "lucide-react";
import { Panel, TextInput } from "@/components/SheetPrimitives/SheetPrimitives";
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";

const INFO_FIELDS = [
	{ key: "name" as const, label: "姓名", placeholder: "调查员姓名" },
	{ key: "player" as const, label: "玩家", placeholder: "玩家姓名" },
	{ key: "age" as const, label: "年龄", placeholder: "25", type: "number" },
	{ key: "era" as const, label: "时代", placeholder: "1920s" },
	{ key: "gender" as const, label: "性别", placeholder: "男 / 女 / 其他" },
	{ key: "nationality" as const, label: "国籍", placeholder: "中国" },
	{ key: "residence" as const, label: "住地", placeholder: "上海" },
	{ key: "birthplace" as const, label: "故乡", placeholder: "波士顿" },
	{ key: "portrait" as const, label: "头像 URL", placeholder: "https://example.com/portrait.png" },
] as const;

export default function InfoPanel({
	inDialog = false,
	readOnly,
}: {
	inDialog?: boolean;
	readOnly?: boolean;
}) {
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const info = useCharacterStore((state) => state.info);
	const setInfo = useCharacterStore((state) => state.setInfo);
	const isReadOnly = readOnly ?? storeReadOnly;

	const content = (
		<div className="grid gap-5">
			<div className="flex items-start gap-3">
				<IdCard className="mt-0.5 text-primary" />
				<div className="grid gap-1">
					<h2 className="text-base font-semibold uppercase tracking-widest">调查员信息</h2>
					<p className="text-sm text-muted-foreground">
						填写角色的基础身份信息，职业模板和职业点配置在职业面板中处理
					</p>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{INFO_FIELDS.map(({ key, label, placeholder, ...rest }) =>
					isReadOnly ? (
						<ReadOnlyField key={key} label={label} value={info[key] ?? ""} placeholder={placeholder} />
					) : (
						<TextInput
							key={key}
							type={(rest as { type?: string }).type || "text"}
							label={label}
							placeholder={placeholder}
							value={info[key] ?? ""}
							onChange={(event) => {
								const value =
									(rest as { type?: string }).type === "number"
										? event.target.value === ""
											? ""
											: Number(event.target.value)
										: event.target.value;
								setInfo(key, value as string & number);
							}}
						/>
					),
				)}
			</div>
		</div>
	);

	if (inDialog) {
		return content;
	}

	return <Panel>{content}</Panel>;
}
