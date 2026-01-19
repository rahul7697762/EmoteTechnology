import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roles } from './data';

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
    return (
        <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                    <motion.button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300
                            ${isSelected
                                ? `bg-gradient-to-br ${role.gradient} border-transparent shadow-xl ${role.glow}`
                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                            }
                        `}
                    >
                        <Icon
                            size={26}
                            className={isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                        />
                        <span className={`text-sm font-semibold mt-2 ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {role.label}
                        </span>
                        <span className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'}`}>
                            {role.description}
                        </span>
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${role.gradient}`}></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default RoleSelector;
