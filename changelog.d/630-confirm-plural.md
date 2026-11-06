### Fixed

- A CommandBar confirm dialog's `confirm.plural` can be a plural object (`{ one, other }`; Arabic `{ zero, one, two, few, many, other }`): the count picks the noun's form by the locale's plural rules, so Arabic reads "حذف 11 ملفًا" and English "Delete 1 file". A plain string still works (#630).
