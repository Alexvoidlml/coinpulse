"use client"

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<T> {
    columns: {
        header: string;
        accessorKey?: string;
        cell?: (props: { row: { original: T } }) => React.ReactNode;
        cellClassName?: string;
    }[];
    data: T[];
    rowKey: (row: { original: T }, index: number) => string | number;
    tableClassName?: string;
    headerClassName?: string;
    headerRowClassName?: string;
    bodyRowClassName?: string;
    bodyCellClassName?: string;
}

export default function DataTable<T>({
                                         columns,
                                         data,
                                         rowKey,
                                         tableClassName,
                                         headerClassName,
                                         headerRowClassName,
                                         bodyRowClassName,
                                         bodyCellClassName,
                                     }: DataTableProps<T>) {
    return (
        <div className={cn("rounded-md border border-white/10 bg-black/5", tableClassName)}>
            <Table>
                <TableHeader className={headerClassName}>
                    <TableRow className={cn("hover:bg-transparent border-b border-white/10", headerRowClassName)}>
                        {columns.map((column, index) => (
                            <TableHead
                                key={index}
                                className={cn("text-gray-400 font-medium py-4", column.cellClassName)}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <TableRow
                                key={rowKey({ original: item }, rowIndex)}
                                className={cn("border-b border-white/5 hover:bg-white/5 transition-colors", bodyRowClassName)}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        className={cn("py-4", bodyCellClassName)}
                                    >
                                        {column.cell
                                            ? column.cell({ row: { original: item } })
                                            : column.accessorKey?.includes('.')
                                                ? column.accessorKey.split('.').reduce((o: any, i: string) => o?.[i], item)
                                                : (item as any)[column.accessorKey || '']
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-gray-500"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}